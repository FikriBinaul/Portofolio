"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import WidgetDeck from "@/components/WidgetDeck";

/* ===========================================================
   WIDGETS PANEL — hidden by default, revealed on demand
   A grabber handle lives on the left edge. Click it (or drag
   it rightward) to slide the widget deck out; click again or
   drag left to stow it. Position persists per session state.
   =========================================================== */

const OPEN_W = 300; // visible width of the open panel (px)
const HANDLE_W = 34; // grabber width (px)

export default function WidgetPanel() {
  const [open, setOpen] = useState(false);
  const drag = useRef<{ startX: number; baseX: number } | null>(null);
  const dragged = useRef(false);
  const [dragX, setDragX] = useState<number | null>(null); // live drag offset
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelW, setPanelW] = useState(OPEN_W);

  /* measure the real panel width so it hides completely */
  useEffect(() => {
    const measure = () => setPanelW(panelRef.current?.offsetWidth ?? OPEN_W);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* the panel slides between fully off-screen and 0 */
  const hiddenX = -(panelW + 24);
  const currentX = dragX ?? (open ? 0 : hiddenX);

  const onHandleDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      /* synthetic or stale pointer — ignore */
    }
    drag.current = { startX: e.clientX, baseX: currentX };
    dragged.current = false;
    e.stopPropagation();
  };

  const onHandleMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (!d) return;
      const moved = e.clientX - d.startX;
      if (Math.abs(moved) >= 8) dragged.current = true;
      const raw = d.baseX + moved;
      setDragX(Math.max(hiddenX - 24, Math.min(12, raw)));
    },
    [hiddenX]
  );

  const onHandleUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        /* ignore */
      }
      const d = drag.current;
      drag.current = null;
      setDragX(null);
      if (!d) return;
      const moved = e.clientX - d.startX;
      if (Math.abs(moved) >= 8) {
        // a real drag: open if pulled right, close if pulled left
        setOpen(moved > 40 || (moved > -40 && d.baseX > hiddenX / 2));
      }
      // small movements fall through to onClick for the toggle
    },
    [hiddenX]
  );

  const onHandleClick = useCallback(() => {
    if (dragged.current) return; // that was a drag, not a click
    setOpen((o) => !o);
  }, []);

  return (
    <>
      {/* grabber — always visible on the left edge */}
      <motion.div
        className="wp-grabber"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18, delay: 1.1 }}
        onPointerDown={onHandleDown}
        onPointerMove={onHandleMove}
        onPointerUp={onHandleUp}
        onPointerCancel={onHandleUp}
        onClick={onHandleClick}
        title={open ? "Hide widgets" : "Show widgets"}
        role="button"
        tabIndex={0}
        aria-label={open ? "Hide widget panel" : "Show widget panel"}
        aria-expanded={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
      >
        <span className={`wp-grip ${open ? "open" : ""}`}>
          {open ? "‹" : "›"}
        </span>
        <span className="wp-label">{open ? "HIDE" : "WIDGETS"}</span>
      </motion.div>

      {/* sliding panel */}
      <motion.div
        className="wp-panel"
        ref={panelRef}
        initial={false}
        animate={{ x: currentX }}
        transition={
          dragX !== null
            ? { duration: 0 }
            : { type: "spring", stiffness: 210, damping: 26 }
        }
        aria-hidden={!open}
      >
        <WidgetDeck />
      </motion.div>
    </>
  );
}
