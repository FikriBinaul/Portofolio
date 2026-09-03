"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { REMOTE_ASSETS } from "@/lib/data";

/* -----------------------------------------------------------
   PCB TRACES — deterministic "copper route" generator so the
   decorative circuit layer is identical on every render.
   ----------------------------------------------------------- */
const VB_W = 1600;
const VB_H = 900;

const TRACE_COLORS = [
  "rgba(124,108,255,0.55)",
  "rgba(100,210,255,0.42)",
  "rgba(50,215,75,0.34)",
  "rgba(255,107,74,0.30)",
];

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

interface Trace {
  d: string;
  color: string;
  pads: [number, number][];
}

function genTraces(count: number, seed: number): Trace[] {
  const rnd = lcg(seed);
  const traces: Trace[] = [];
  for (let t = 0; t < count; t++) {
    let x = 40 + rnd() * 200;
    let y = 60 + rnd() * (VB_H - 160);
    let dir: 0 | 1 = rnd() > 0.5 ? 0 : 1;
    const pts: [number, number][] = [[Math.round(x), Math.round(y)]];
    const steps = 5 + Math.floor(rnd() * 4);
    for (let i = 0; i < steps; i++) {
      const len = 70 + Math.floor(rnd() * 150);
      if (dir === 0) x += rnd() > 0.5 ? len : -len;
      else y += rnd() > 0.5 ? len : -len;
      x = Math.max(16, Math.min(VB_W - 16, x));
      y = Math.max(16, Math.min(VB_H - 16, y));
      dir = dir === 0 ? 1 : 0;
      pts.push([Math.round(x), Math.round(y)]);
    }
    const d = pts
      .map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`))
      .join(" ");
    traces.push({
      d,
      color: TRACE_COLORS[t % TRACE_COLORS.length],
      pads: pts,
    });
  }
  return traces;
}

const PCB_TRACES = genTraces(16, 20260501);
// a handful of "live" routes carry an animated data pulse
const LIVE_INDEXES = [1, 7, 12];

/** Animated mesh wallpaper — remote gradient under PCB traces. */
export default function Wallpaper() {
  return (
    <>
      <div className="wallpaper" aria-hidden="true">
        <Image
          src={REMOTE_ASSETS.wallpaper}
          alt=""
          fill
          priority
          sizes="100vw"
          className="wallpaper-img"
        />
        <div className="wallpaper-veil" />
        <div className="wash" />
        <svg
          className="pcb-layer"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid slice"
        >
          {PCB_TRACES.map((tr, i) => (
            <g key={i}>
              <path d={tr.d} className="pcb-trace" style={{ stroke: tr.color }} />
              {tr.pads.map(([px, py], j) => (
                <circle key={j} cx={px} cy={py} r="3" className="pcb-pad" style={{ fill: tr.color }} />
              ))}
              {LIVE_INDEXES.includes(i) && (
                <path d={tr.d} className="trace-live" style={{ stroke: tr.color }} />
              )}
            </g>
          ))}
        </svg>
      </div>
      <motion.div
        className="grain"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.045 }}
        transition={{ duration: 2 }}
      />
    </>
  );
}