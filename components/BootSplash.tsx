"use client";

import { motion } from "framer-motion";

/** Boot overlay — plays once when the desktop powers on. */
export default function BootSplash() {
  return (
    <motion.div
      className="boot-splash"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
    >
      <motion.div
        className="boot-logo"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 170, damping: 15 }}
      >
        FBU
      </motion.div>
      <div className="boot-name">PORTFOLIO_OS 3.0</div>
      <div className="boot-bar">
        <motion.div
          className="boot-fill"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.25, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}