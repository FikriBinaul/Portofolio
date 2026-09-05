"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useDesktop } from "@/components/DesktopContext";

/* ===========================================================
   STORY.APP v2 — cinematic, image-driven storyteller
   A scroll-snap deck of chapters. Each chapter has:
     • a full-bleed backdrop image that crossfades + Ken-Burns
       as you scroll (the "visual changes with scroll")
     • an interactive gallery plate whose photos auto-rotate
       (or swap on tap) inside the slide
   Auto-plays like a keynote until paused; works with touch.
   =========================================================== */

interface StoryChapter {
  chip: string;
  title: string;
  kicker: string;
  body: string;
  fact: string;
  /** Optional app id — CTA opens it. */
  open?: string;
  accent: string;
  /** Full-bleed backdrop. */
  hero: string;
  /** Interactive gallery: [url, caption]. */
  gallery: [string, string][];
}

const U = (id: string, w = 1280) =>
  `https://images.unsplash.com/${id}?q=72&w=${w}&auto=format&fit=crop`;

const CHAPTERS: StoryChapter[] = [
  {
    chip: "01 · ORIGIN",
    title: "It started with a breadboard",
    kicker: "2021 — Bogor, Indonesia",
    body: "Long before research labs and hackathons, there was a desk, a soldering iron, and the question every hardware engineer remembers: what if this board could think? That curiosity became a Computer Engineering Technology degree at IPB University — GPA 3.62, earned between solder fumes and late-night datasheets.",
    fact: "5+ years of hands-on technical experience began here.",
    accent: "#64D2FF",
    hero: U("photo-1518770660439-4636190af475", 1600),
    gallery: [
      [U("photo-1581092160562-40aa08e78837", 900), "First flash: firmware, meet reality."],
      [U("photo-1519389950473-47ba0277781c", 900), "Late nights, endless breadboards."],
    ],
  },
  {
    chip: "02 · FIRST DEPLOY",
    title: "FarmShield leaves the bench",
    kicker: "2023 — Agriculture IoT",
    body: "The first real system: an ESP32 network that watches a field. FarmShield reads soil and environment sensors over IoT links and flags threats before they spread across a crop — my first lesson that good hardware is 10% wiring and 90% decisions about what to do when reality misbehaves.",
    fact: "First shipped sensor system — still running.",
    open: "projects",
    accent: "#32D74B",
    hero: U("photo-1500382017468-9049fed747ef"),
    gallery: [
      [U("photo-1416879595882-3373a0480b5b", 900), "Rows of sensors watching rows of crops."],
      [U("photo-1470071459604-3b5ec3a7fe05", 900), "The field never sleeps."],
    ],
  },
  {
    chip: "03 · SWARM SEASON",
    title: "Machines that think together",
    kicker: "2024 — IPB Lecturer Research",
    body: "Swarm Aerator: multiple ESP32 nodes coordinating aeration for aquaculture ponds, communicating as a distributed swarm, scheduling adaptively, and deciding with Random Forest. A HAKI copyright was filed for this work — machines that don't just sense, but collaborate.",
    fact: "HAKI copyright filed — swarm intelligence for fish farming.",
    open: "projects",
    accent: "#FFD426",
    hero: U("photo-1439405326854-014607f694d7"),
    gallery: [
      [U("photo-1476514525535-07fb3b4ae5f1", 900), "Nodes, water, and a shared decision."],
      [U("photo-1507525428034-b723cf961d3e", 900), "Aerators choreographing the pond."],
    ],
  },
  {
    chip: "04 · FIELD PROOF",
    title: "SENTRY, Smart Door Lock & SIRO",
    kicker: "2025 — Deployment Year",
    body: "Systems left the lab: SENTRY put YOLO-based vision on access control, a Smart Door Lock shipped at the UT Digital Hackathon, and SIRO brought smart irrigation into real fields. Seven systems deployed in one year — hardware that survives contact with reality.",
    fact: "7 systems shipped — vision, security, and irrigation.",
    open: "projects",
    accent: "#FF6B4A",
    hero: U("photo-1550751827-4bd374c3f58b"),
    gallery: [
      [U("photo-1517180102446-f3ece451e9d8", 900), "Vision pipelines watching the door."],
      [U("photo-1526374965328-7f61d4dc18c5", 900), "Firmware, shipped to the wild."],
    ],
  },
  {
    chip: "05 · RESEARCH YEAR",
    title: "Reading footsteps at BRIN",
    kicker: "2026 — National Research & Innovation Agency",
    body: "Research internship at BRIN: an intelligent plantar pressure platform using distributed FSR sensor arrays, ESP32 nodes, and Center-of-Pressure analysis for gait assessment — turning footsteps into clinical-grade signals for rehabilitation research.",
    fact: "BRIN research intern — healthcare IoT & gait science.",
    open: "projects",
    accent: "#7C6CFF",
    hero: U("photo-1576091160399-112ba8d25d1d"),
    gallery: [
      [U("photo-1581091226825-a6a2a5aee158", 900), "From pressure readings to gait science."],
      [U("photo-1581092918056-0c4c3acd3789", 900), "Sensors + signal processing at BRIN."],
    ],
  },
  {
    chip: "06 · NEXT CHAPTER",
    title: "The bench is never empty",
    kicker: "FUTURE — Roadmap OS",
    body: "The FSR plantar pipeline is heading toward gait research, the next boards are already on the bench, and I'm open to hardware teams and research groups who need someone who ships. If you're building something that senses, thinks, or moves — this desktop has a dock full of proof.",
    fact: "Open to remote roles & research collaborations.",
    open: "contact",
    accent: "#f472b6",
    hero: U("photo-1485827404703-89b55fcc595e"),
    gallery: [
      [U("photo-1526374965328-7f61d4dc18c5", 900), "The next board, already in progress."],
      [U("photo-1488590528505-98d2b5aba04b", 900), "Code, copper, and what comes next."],
    ],
  },
];

const SLIDE_COUNT = CHAPTERS.length + 1; // + finale

const AUTO_MS = 6800;

export default function AppStory() {
  const { openApp } = useDesktop();
  const deckRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [pic, setPic] = useState(0); // per-chapter gallery index
  const ch = CHAPTERS[Math.min(idx, CHAPTERS.length - 1)];
  const reduce = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  /* ---------- scroll → active slide (crossfades the backdrop) ---------- */
  const updateFromScroll = useCallback(() => {
    const deck = deckRef.current;
    if (!deck || deck.clientHeight === 0) return;
    const mid = deck.scrollTop + deck.clientHeight * 0.5;
    const slides = Array.from(deck.children) as HTMLElement[];
    let best = 0;
    let bestD = Infinity;
    slides.forEach((s, i) => {
      const c = s.offsetTop + s.offsetHeight * 0.5;
      const d = Math.abs(c - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setIdx((p) => (p === best ? p : best));
  }, []);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    deck.addEventListener("scroll", updateFromScroll, { passive: true });
    updateFromScroll();
    return () => deck.removeEventListener("scroll", updateFromScroll);
  }, [updateFromScroll]);

  /* reset gallery photo when the chapter changes */
  useEffect(() => setPic(0), [idx]);

  /* ---------- auto-advance (keynote) ---------- */
  useEffect(() => {
    if (!auto || hover || reduce) return;
    const t = setTimeout(() => {
      const deck = deckRef.current;
      if (!deck) return;
      const slides = Array.from(deck.children) as HTMLElement[];
      const nextTop = slides[Math.min(idx + 1, SLIDE_COUNT - 1)]?.offsetTop ?? 0;
      deck.scrollTo({ top: nextTop, behavior: "smooth" });
    }, AUTO_MS);
    return () => clearTimeout(t);
  }, [idx, auto, hover, reduce]);

  const scrollToSlide = useCallback((i: number) => {
    const deck = deckRef.current;
    if (!deck) return;
    const slides = Array.from(deck.children) as HTMLElement[];
    const el = slides[Math.min(i, SLIDE_COUNT - 1)];
    if (!el) return;
    deck.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  }, []);

  /* keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") {
        scrollToSlide(idx + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
        scrollToSlide(idx - 1);
      } else if (e.key === " ") {
        e.preventDefault();
        scrollToSlide(idx + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, scrollToSlide]);

  const progress = ((idx + 1) / SLIDE_COUNT) * 100;
  const rootStyle = {
    "--sv-ac": ch.accent,
  } as CSSProperties;

  const isFin = idx >= CHAPTERS.length;

  return (
    <div
      className="sv"
      style={rootStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* ---- full-bleed backdrop: crossfade between chapter images ---- */}
      <div className="sv-bg" aria-hidden="true">
        {CHAPTERS.map((c, i) => (
          <div
            key={i}
            className={`sv-bgimg ${i === idx ? "on" : ""} ${i === idx + 1 ? "next" : ""}`}
            style={{ backgroundImage: `url(${c.hero})` }}
          />
        ))}
        <div className="sv-scrim" />
        <div className="sv-bgbar" />
      </div>

      {/* ---- scroll deck of chapters + finale ---- */}
      <div className="sv-deck" ref={deckRef}>
        {CHAPTERS.map((c, i) => (
          <section key={i} className="sv-slide" aria-label={`Chapter ${i + 1}: ${c.title}`}>
            <div className="sv-grid">
              <div className="sv-copy">
                <span className="sv-chip">{c.chip}</span>
                <p className="sv-kicker">{c.kicker}</p>
                <h2 className="sv-title">{c.title}</h2>
                <p className="sv-body">{c.body}</p>
                <div className="sv-fact">
                  <span className="sv-fact-ic">◈</span>
                  {c.fact}
                </div>
                {c.open && (
                  <button className="sv-btn" onClick={() => openApp(c.open!)}>
                    ◈ Open the proof <span className="sv-btn-arr">→</span>
                  </button>
                )}
              </div>

              {/* interactive gallery plate */}
              <div className="sv-plate-wrap">
                <figure className="sv-plate">
                  {c.gallery.map(([src, cap], gi) => (
                    <img
                      key={gi}
                      src={src}
                      alt={cap}
                      className={`sv-plate-img ${gi === pic ? "on" : ""}`}
                      loading="lazy"
                    />
                  ))}
                  <div className="sv-plate-shine" aria-hidden="true" />
                  <figcaption className="sv-plate-cap">
                    {c.gallery[pic][1]}
                  </figcaption>
                </figure>
                <div className="sv-film">
                  <span className="sv-film-label">B-ROLL</span>
                  <div className="sv-film-dots">
                    {c.gallery.map((_, gi) => (
                      <button
                        key={gi}
                        className={`sv-film-dot ${gi === pic ? "on" : ""}`}
                        aria-label={`Show photo ${gi + 1}`}
                        onClick={() => setPic(gi)}
                      />
                    ))}
                  </div>
                  <span className="sv-film-num">
                    {pic + 1}/{c.gallery.length}
                  </span>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* finale slide */}
        <section className="sv-slide sv-fin-slide" aria-label="Finale">
          <div className="sv-fin">
            <div className="sv-fin-mark">✦</div>
            <h2>The story continues…</h2>
            <p>
              The bench is never empty, and the next chapter gets written with the
              teams I join next. Let&apos;s build something that senses, thinks, and
              moves.
            </p>
            <div className="sv-fin-cta">
              <button className="sv-btn" onClick={() => openApp("contact")}>
                ✉ Start a conversation
              </button>
              <button
                className="sv-btn ghost"
                onClick={() => {
                  deckRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                ↺ Replay the story
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ---- HUD + controls ---- */}
      <div className="sv-hud">
        <span className="sv-count">
          {isFin ? "FIN" : String(idx + 1).padStart(2, "0")}
          <i>/</i>
          {String(SLIDE_COUNT - 1).padStart(2, "0")}
        </span>
        <button
          className={`sv-play ${auto ? "on" : ""}`}
          onClick={() => setAuto((a) => !a)}
          aria-label={auto ? "Pause auto-advance" : "Play auto-advance"}
        >
          {auto ? "❚❚" : "▶"}
        </button>
        <div className="sv-dots">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <button
              key={i}
              className={`sv-dot ${i === idx ? "on" : ""}`}
              aria-label={i === SLIDE_COUNT - 1 ? "Go to finale" : `Go to chapter ${i + 1}`}
              onClick={() => scrollToSlide(i)}
            />
          ))}
        </div>
        <div className="sv-progress" aria-hidden="true">
          <span className="sv-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <button className="sv-nav" onClick={() => scrollToSlide(idx + 1)}>
          {isFin ? "↺" : "Next →"}
        </button>
      </div>
    </div>
  );
}
