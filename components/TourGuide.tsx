"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ===========================================================
   TOUR GUIDE — first-visit walkthrough of PORTFOLIO_OS
   A pulsing ring points at the real UI (dock, menu bar,
   window chrome…) while a card explains what to do. Steps
   can trigger actions (open an app) and the tour remembers
   in localStorage — replays from Help ▸ Take the tour.
   =========================================================== */

interface TourStep {
  id: string;
  title: string;
  body: string;
  /** CSS selector of the element to spotlight; null = center stage. */
  target: string | null;
  /** Where to place the card relative to the target. */
  side: "top" | "bottom" | "left" | "right" | "center";
  /** Optional app to open when the step appears. */
  open?: string;
}

const STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to PORTFOLIO_OS",
    body: "This portfolio is a working desktop — every project, certificate, and skill lives inside an app. Take 30 seconds and I'll show you around.",
    target: null,
    side: "center",
  },
  {
    id: "profile",
    title: "This is the profile",
    body: "Fikri's System Profile — the quick summary of who he is, what he builds, and how to reach him.",
    target: ".win",
    side: "left",
  },
  {
    id: "dock",
    title: "Everything lives in the Dock",
    body: "One click on any icon opens its app — Projects, Certificates, the AI Assistant, even a Snake minigame. Hover to magnify, exactly like macOS.",
    target: ".dock",
    side: "top",
  },
  {
    id: "apps",
    title: "Try opening an app",
    body: "Click the pink Story book for a guided visual journey, or ✦ Assistant to ask the on-device AI anything about Fikri.",
    target: ".dock",
    side: "top",
    open: "story",
  },
  {
    id: "menubar",
    title: "Navigate from the menu bar",
    body: "The top bar jumps straight to any section, ⌘K opens Spotlight search, and the clock is live — just like a real OS.",
    target: ".menubar",
    side: "bottom",
  },
  {
    id: "windows",
    title: "Windows are real windows",
    body: "Drag by the title bar, resize from the corner, minimize to the dock — and the red dot closes. Arrange your workspace however you like.",
    target: ".win",
    side: "left",
  },
  {
    id: "done",
    title: "You're all set",
    body: "That's the tour! Explore freely — and if you want the 2-minute cinematic version of the whole story, open 📖 Story from the dock.",
    target: ".dock",
    side: "top",
    open: "story",
  },
];

const KEY = "fbu-tour-done-v1";

/** Measure the spotlight rect for the active step. */
function useTargetRect(selector: string | null, active: boolean) {
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!active || !selector) {
      setRect(null);
      return;
    }
    const measure = () => {
      const el = document.querySelector(selector);
      if (!el) {
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({ x: r.x, y: r.y, w: r.width, h: r.height });
    };
    measure();
    // track resize + a short settle period (windows animate in)
    const settle = window.setInterval(measure, 350);
    window.addEventListener("resize", measure);
    return () => {
      window.clearInterval(settle);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf.current);
    };
  }, [selector, active]);

  return rect;
}

export default function TourGuide({ open, onOpenApp }: { open: boolean; onOpenApp: (id: string) => void }) {
  const [enabled, setEnabled] = useState(false);
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const lastOpen = useRef<string | undefined>(undefined);

  /* first visit only (unless replayed from Help) */
  useEffect(() => {
    if (!open) return;
    let seen = false;
    try {
      seen = localStorage.getItem(KEY) === "1";
    } catch {
      /* private mode */
    }
    if (!seen) setEnabled(true);
  }, [open]);

  /* fire the step's app action once per entry into the step */
  useEffect(() => {
    if (!enabled || !open) return;
    if (s.open && lastOpen.current !== s.id) {
      lastOpen.current = s.id;
      const t = setTimeout(() => onOpenApp(s.open!), 550);
      return () => clearTimeout(t);
    }
  }, [enabled, open, s, onOpenApp]);

  const rect = useTargetRect(enabled && open ? s.target : null, enabled && open);

  const finish = useCallback(() => {
    setEnabled(false);
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const next = () => (step >= STEPS.length - 1 ? finish() : setStep((i) => i + 1));
  const back = () => setStep((i) => Math.max(0, i - 1));

  /* card position */
  const cardStyle = useMemo<CSSProperties>(() => {
    if (s.side === "center" || !rect) {
      return { left: "50%", top: "50%", transform: "translate(-50%,-50%)" };
    }
    const pad = 22;
    switch (s.side) {
      case "top":
        return { left: "50%", bottom: `calc(100% - ${rect.y - pad}px)`, transform: "translateX(-50%)" };
      case "bottom":
        return { left: "50%", top: rect.y + rect.h + pad, transform: "translateX(-50%)" };
      case "left":
        return { left: Math.max(16, rect.x - pad), top: rect.y + rect.h + pad, transform: "translateX(-100%)" };
      case "right":
        return { left: rect.x + rect.w + pad, top: rect.y + rect.h + pad };
    }
  }, [s.side, rect]);

  if (!enabled || !open) return null;

  const ringStyle: CSSProperties | null =
    rect
      ? {
          left: rect.x - 10,
          top: rect.y - 10,
          width: rect.w + 20,
          height: rect.h + 20,
        }
      : null;

  return (
    <div className="tour-root" role="dialog" aria-modal="true" aria-label="Portfolio tour">
      {/* dim + block clicks outside the spotlight */}
      <AnimatePresence>
        <motion.div
          key="veil"
          className="tour-veil"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={finish}
        />
      </AnimatePresence>

      {/* spotlight ring */}
      <AnimatePresence>
        {ringStyle && (
          <motion.div
            key={s.id}
            className="tour-ring"
            style={ringStyle}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
          />
        )}
      </AnimatePresence>

      {/* card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={s.id}
          className="tour-card"
          style={cardStyle}
          initial={s.side === "center" ? { opacity: 0, scale: 0.94, y: 10 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <span className="tour-count">
            {step + 1} / {STEPS.length}
          </span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
          <div className="tour-actions">
            <div className="tour-dots">
              {STEPS.map((_, i) => (
                <span key={i} className={`tour-dot ${i === step ? "on" : ""}`} />
              ))}
            </div>
            <div className="tour-btns">
              <button className="tour-skip" onClick={finish}>
                Skip
              </button>
              {step > 0 && (
                <button className="tour-back" onClick={back}>
                  Back
                </button>
              )}
              <button className="tour-next" onClick={next}>
                {step === STEPS.length - 1 ? "Start exploring ✓" : "Next →"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
