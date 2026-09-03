"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { CAPABILITIES } from "@/lib/data";

/** 05 — Capabilities / a minimal signal-chain chip trail */
export default function Capabilities() {
  return (
    <>
          <div className="section-eyebrow">
            <span className="idx">05</span> Capabilities
          </div>
          <h2 className="section-title">One signal chain.</h2>
          <p className="section-sub">
            Sense it, connect it, think on it, secure it, operate it, document it.
          </p>

          <div className="chain-min">
            {CAPABILITIES.map((cap, i) => (
              <Fragment key={cap.title}>
                <motion.div
                  className="chain-min-node"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ type: "spring", stiffness: 150, damping: 16, delay: i * 0.05 }}
                >
                  <div className="chain-min-icon" style={{ background: cap.color }}>
                    {cap.icon}
                  </div>
                  <div className="chain-min-label">{cap.title}</div>
                </motion.div>
                {i < CAPABILITIES.length - 1 && (
                  <div className="chain-min-conn" style={{ "--i": i } as never} aria-hidden="true" />
                )}
              </Fragment>
            ))}
          </div>
    </>
  );
}