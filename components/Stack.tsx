"use client";

import { motion } from "framer-motion";
import { STACK_GROUPS } from "@/lib/data";

/** Slight scatter rotations so the tools look tossed onto the bench. */
const TILT = [-3.5, 2.5, -2, 4, -1.5, 3, -3, 2, -2.5, 3.5, -1];

function BenchTool({
  abbr,
  label,
  color,
  tilt,
  delay,
}: {
  abbr: string;
  label: string;
  color: string;
  tilt: number;
  delay: number;
}) {
  return (
    <motion.div
      className="tool"
      initial={{ opacity: 0, y: 26, scale: 0.9, rotate: tilt * 2 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: tilt }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ type: "spring", stiffness: 160, damping: 14, delay }}
      whileHover={{ y: -10, rotate: 0, scale: 1.08 }}
    >
      <div className={`tool-face ${color}`}>{abbr}</div>
      <div className="tool-label">{label}</div>
    </motion.div>
  );
}

/** 04 — Tech Stack / the workbench */
export default function Stack() {
  const onDevice = STACK_GROUPS[0].items;
  const aroundIt = STACK_GROUPS[1].items;

  return (
    <>
          <div className="section-eyebrow">
            <span className="idx">04</span> Tech Stack
          </div>
          <h2 className="section-title">The instruments on my bench.</h2>
          <p className="section-sub">
            Everything laid out the way it lives in the lab — the on-device tools on one side, the
            software around them on the other.
          </p>

          <div className="bench">
            <div className="bench-rail">
              <span className="bench-screw" />
              <span className="bench-led" />
              <span className="bench-screw" />
            </div>

            <div className="bench-top">
              <div className="bench-plates">
                <div className="bench-plate">ON THE DEVICE</div>
                <div className="bench-plate">EVERYTHING AROUND IT</div>
              </div>

              <div className="bench-zone">
                {onDevice.map((item, i) => (
                  <BenchTool
                    key={item.label}
                    abbr={item.abbr}
                    label={item.label}
                    color={item.color}
                    tilt={TILT[i]}
                    delay={0.05 * i}
                  />
                ))}
              </div>

              <div className="bench-split" />

              <div className="bench-zone">
                {aroundIt.map((item, i) => (
                  <BenchTool
                    key={item.label}
                    abbr={item.abbr}
                    label={item.label}
                    color={item.color}
                    tilt={TILT[5 + i]}
                    delay={0.05 * (5 + i)}
                  />
                ))}
              </div>
            </div>

            <div className="bench-front" />
          </div>
    </>
  );
}