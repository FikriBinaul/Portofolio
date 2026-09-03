"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { STATS, TERMINAL_LINES } from "@/lib/data";

/** Terminal that types out the profile readout when scrolled into view. */
function TypingTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const [lineIdx, setLineIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (inView && !started) setStarted(true);
  }, [inView, started]);

  useEffect(() => {
    if (!started || done) return;
    if (reduce) {
      setDone(true);
      return;
    }
    if (lineIdx >= TERMINAL_LINES.length) {
      setDone(true);
      return;
    }
    const line = TERMINAL_LINES[lineIdx];
    if (chars < line.t.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 14);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIdx((i) => i + 1);
      setChars(0);
    }, 160);
    return () => clearTimeout(t);
  }, [started, done, reduce, lineIdx, chars]);

  const showCursor = !done || lineIdx === TERMINAL_LINES.length;

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="tdot r" />
        <span className="tdot y" />
        <span className="tdot g" />
        <span className="terminal-title">engineer_profile.sh</span>
      </div>
      <div className="terminal-body" ref={ref}>
        {TERMINAL_LINES.map((line, i) => {
          const isCurrent = i === lineIdx && !done;
          const text = isCurrent ? line.t.slice(0, chars) : i < lineIdx || reduce ? line.t : "";
          return (
            <div key={i} className={line.cls ?? ""}>
              {text}
            </div>
          );
        })}
        {showCursor && <span className="terminal-cursor" />}
      </div>
    </div>
  );
}

/** Animated count-up stat tile. */
function StatTile({ target, suffix, label, delay }: { target: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(target);
      return;
    }
    const duration = 1100;
    let start: number | null = null;
    let raf: number;
    const frame = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.round(p * target));
      if (p < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target]);

  return (
    <div className="widget-tile" ref={ref}>
      <div className="num">
        {value}
        {suffix}
      </div>
      <div className="lbl">{label}</div>
    </div>
  );
}

/** 01 — Who Am I */
export default function About() {
  return (
    <div className="sheet">
      <div className="sheet-paper">
        <i className="sheet-c tl" aria-hidden="true" />
        <i className="sheet-c tr" aria-hidden="true" />
        <i className="sheet-c bl" aria-hidden="true" />
        <i className="sheet-c br" aria-hidden="true" />
          <div className="section-eyebrow">
            <span className="idx">01</span> Who Am I
          </div>
          <h2 className="section-title">Every system starts with a signal.</h2>
          <p className="section-sub">A quick profile — read from the terminal, or the card next to it.</p>

          <div className="who-grid">
            <TypingTerminal />

            <div className="profile-card">
              <div className="avatar-ring">
                <Image
                  src="/images/fikri-binaul-umah.jpg"
                  alt="Fikri Binaul Umah"
                  width={76}
                  height={76}
                />
              </div>
              <div className="profile-name">Fikri Binaul Umah</div>
              <div className="profile-role">Computer Engineering Technology, IPB University</div>
              <div className="profile-tags">
                <span className="tag">Embedded Systems</span>
                <span className="tag">IoT</span>
                <span className="tag">AI / CV</span>
                <span className="tag">Research</span>
              </div>
              <div className="profile-divider">
                <div className="kv-row">
                  <span className="k">GPA</span>
                  <span className="v">3.62 / 4.00</span>
                </div>
                <div className="field-label">Academic Focus</div>
                <div className="field-text">
                  Embedded Systems, IoT, and Applied Computer Vision for Industrial &amp; Agricultural
                  Automation
                </div>
                <div className="field-label">Relevant Coursework</div>
                <div className="profile-tags">
                  <span className="tag">Microcontroller Systems</span>
                  <span className="tag">Digital Signal Processing</span>
                  <span className="tag">Computer Networks</span>
                  <span className="tag">Machine Learning</span>
                  <span className="tag">Database Systems</span>
                  <span className="tag">Control Systems</span>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className="widget-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.4 }}
              >
                <StatTile target={s.target} suffix={s.suffix} label={s.label} delay={i} />
              </motion.div>
            ))}
          </motion.div>
            <div className="sheet-block">
              <span className="sb-cell">DRAWN: FBU · EMBEDDED SYSTEMS</span>
              <span className="sb-cell">SHEET 01 OF 09 · REV C</span>
              <span className="sb-cell">SCALE 1:1 · IPB UNIV.</span>
            </div>
          </div>
        </div>
  );
}