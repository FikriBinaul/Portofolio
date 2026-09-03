"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "@/lib/data";

/** Menu ids → app registry ids. */
const APP_ALIAS: Record<string, string> = {
  "who-am-i": "about",
  journey: "experience",
};

interface MenuBarProps {
  activeApp: string;
  eraChip?: string;
  onOpenSpotlight: () => void;
  onOpenApp: (id: string) => void;
}

/** Fixed macOS menu bar — clock, section menu, Spotlight trigger. */
export default function MenuBar({
  activeApp,
  eraChip = "2026",
  onOpenSpotlight,
  onOpenApp,
}: MenuBarProps) {
  const [clock, setClock] = useState("--:--");

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.header
      className="menubar"
      initial={{ y: -46 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
    >
      <div className="menubar-brand">
        <span className="glyph">FBU</span>
        <span className="menubar-app-name" id="menubarApp">
          {activeApp}
        </span>
      </div>
      <nav className="menubar-items" aria-label="Launch menu">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            data-target={item.id}
            onClick={() => onOpenApp(APP_ALIAS[item.id] ?? item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="menubar-spacer" />
      <div className="menubar-right">
        <span className="status-pill">
          <span className="dot" /> Open to opportunities
        </span>
        <span className="tm-pill" title="⏳ Time Machine — drag the widget on the desktop to travel years">
          ⏳ {eraChip}
        </span>
        <button className="spotlight-trigger" onClick={onOpenSpotlight} aria-label="Open Spotlight search">
          ⌘ Search <kbd>⌘K</kbd>
        </button>
        <span className="mb-icos" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M2 9.6a15.4 15.4 0 0 1 20 0" />
            <path d="M5.4 13.7a10.4 10.4 0 0 1 13.2 0" />
            <circle cx="12" cy="18.2" r="1.7" fill="currentColor" stroke="none" />
          </svg>
          <span className="batt" title="Battery 84%">
            <i />
          </span>
        </span>
        <span className="menubar-clock">{clock}</span>
      </div>
    </motion.header>
  );
}