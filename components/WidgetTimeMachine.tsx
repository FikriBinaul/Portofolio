"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDesktop } from "@/components/DesktopContext";
import { ERA_META, ERA_ORDER, eraLabel, type EraId } from "@/lib/eras";

const TICKS = ERA_ORDER.map((id) => ({ id, label: eraLabel(id), meta: ERA_META[id] }));

/** ⏳ Time Machine widget — drag through the years, the whole desktop follows. */
export default function WidgetTimeMachine() {
  const { era, setEra } = useDesktop();
  const idx = Math.max(0, TICKS.findIndex((t) => t.id === era));
  const [flash, setFlash] = useState<EraId | null>(null);

  const meta = ERA_META[era];

  const onChange = (v: number) => {
    const next = TICKS[Math.min(TICKS.length - 1, Math.max(0, v))].id;
    if (next === era) return;
    setFlash(next);
    window.setTimeout(() => {
      setEra(next);
      window.setTimeout(() => setFlash(null), 620);
    }, 90);
  };

  const marks = useMemo(() => TICKS.map((t, i) => ({ i, ...t })), []);

  return (
    <div className="tm-widget">
      <div className="tm-head">
        <span className="tm-title">⏳ TIME MACHINE</span>
        <span className={`tm-chip theme-${meta.theme}`} data-era={era}>
          SNAPSHOT · {meta.chip}
        </span>
      </div>

      <input
        className="tm-slider"
        type="range"
        min={0}
        max={TICKS.length - 1}
        step={1}
        value={idx}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Time Machine — travel to a portfolio year"
      />

      <div className="tm-marks">
        {marks.map((m) => (
          <button
            key={m.label}
            className={`tm-mark ${m.i === idx ? "on" : ""}`}
            onClick={() => onChange(m.i)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="tm-sub">
        <b>{meta.label}</b> — {meta.blurb}
      </div>

      <AnimatePresence>
        {flash && (
          <motion.div
            className="tm-flash"
            key={String(flash)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            ⟲ LOADING {eraLabel(flash)} SNAPSHOT
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
