"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Ruler = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <rect x="2" y="9" width="20" height="6" rx="1" />
    <path d="M6 9v3M10 9v3M14 9v3M18 9v3" />
  </svg>
);
const Bolt = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
  </svg>
);
const Robot = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <rect x="4" y="7" width="16" height="12" rx="3" />
    <circle cx="9" cy="13" r="1.4" />
    <circle cx="15" cy="13" r="1.4" />
    <path d="M12 7V4" />
    <circle cx="12" cy="2.8" r="0.9" fill="currentColor" stroke="none" />
    <path d="M9 19v1.5M15 19v1.5" />
  </svg>
);
const Wrench = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M14.5 6.3a4.5 4.5 0 0 0-6 5.6L3 17.4V21h3.6l5.5-5.5a4.5 4.5 0 0 0 5.6-6L14.6 12l-2.6-2.6 2.5-3.1z" />
  </svg>
);
const Wave = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M2 12h3l2-5 3 10 3-14 2 9h7" />
  </svg>
);
const Chip = () => (
  <svg viewBox="0 0 24 24" {...stroke} style={{ overflow: "visible" }}>
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
  </svg>
);
const Doc = () => (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M6 2h8l4 4v16H6V2z" />
    <path d="M14 2v4h4" />
    <path d="M9 12h6M9 16h6" />
  </svg>
);

const SYMBOLS: { title: string; icon: ReactNode }[] = [
  { title: "Technical drawing", icon: <Ruler /> },
  { title: "Bench & bring-up", icon: <Bolt /> },
  { title: "Robotics & mechatronics", icon: <Robot /> },
  { title: "Hands-on assembly", icon: <Wrench /> },
  { title: "PCB & signal integrity", icon: <Wave /> },
  { title: "Microcontroller cores", icon: <Chip /> },
  { title: "Drafting & documentation", icon: <Doc /> },
];

/** 06 — Hardware Lab / symbols only */
export default function Machines() {
  return (
    <>
          <div className="section-eyebrow">
            <span className="idx">06</span> Hardware Lab
          </div>
          <h2 className="section-title">Machines I design around.</h2>
          <p className="section-sub">From the first sketch to the field deployment.</p>

          <div className="sym-grid">
            {SYMBOLS.map((sym, i) => (
              <motion.div
                className="sym"
                key={sym.title}
                initial={{ opacity: 0, y: 14, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ type: "spring", stiffness: 150, damping: 17, delay: (i % 4) * 0.06 }}
                whileHover={{ y: -5 }}
              >
                <div className="sym-icon">{sym.icon}</div>
                <div className="sym-label">{sym.title}</div>
              </motion.div>
            ))}
          </div>
    </>
  );
}