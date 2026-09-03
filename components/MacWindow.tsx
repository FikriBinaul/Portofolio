"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MacWindowProps {
  title: string;
  children: ReactNode;
  delay?: number;
}

/** macOS-style window shell with traffic lights + titlebar. */
export default function MacWindow({ title, children, delay = 0 }: MacWindowProps) {
  return (
    <motion.div
      className="mac-window"
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay }}
    >
      <div className="mac-titlebar">
        <div className="traffic">
          <span className="tdot r" />
          <span className="tdot y" />
          <span className="tdot g" />
        </div>
        <div className="mac-title">{title}</div>
      </div>
      <div className="mac-window-body">{children}</div>
    </motion.div>
  );
}