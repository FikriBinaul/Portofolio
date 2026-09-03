"use client";

import { motion } from "framer-motion";

const ICONS: { id: string; icon: string; label: string; c1: string; c2: string }[] = [
  { id: "profile", icon: "⌂", label: "System\nProfile", c1: "#7C6CFF", c2: "#4d3ffb" },
  { id: "about", icon: "☺", label: "About", c1: "#64D2FF", c2: "#2a95d1" },
  { id: "projects", icon: "⚙", label: "Projects", c1: "#FF6B4A", c2: "#e04b2c" },
  { id: "stack", icon: "▦", label: "Stack", c1: "#FFD426", c2: "#e0a800" },
  { id: "certificates", icon: "◧", label: "Certificates", c1: "#a78bfa", c2: "#6d4fe0" },
  { id: "contact", icon: "✉", label: "Contact", c1: "#32D74B", c2: "#1a9c34" },
];

/** Desktop shortcut icons — single click launches, animated in after boot. */
export default function DesktopIcons({
  onOpen,
  ready,
  allowed,
}: {
  onOpen: (id: string) => void;
  ready: boolean;
  allowed?: Set<string>;
}) {
  const visible = allowed ? ICONS.filter((it) => allowed.has(it.id)) : ICONS;
  return (
    <div className="desktop-icons" role="toolbar" aria-label="Desktop icons">
      {visible.map((it, i) => (
        <motion.button
          key={it.id}
          className="dicon"
          style={{ "--di1": it.c1, "--di2": it.c2 } as never}
          onClick={() => onOpen(it.id)}
          aria-label={`Open ${it.label.replace("\n", " ")}`}
          title={`Click to open ${it.label.replace("\n", " ")}`}
          initial={{ opacity: 0, x: 26, scale: 0.8 }}
          animate={ready ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 26, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 190, damping: 19, delay: 0.18 + i * 0.07 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="dicon-glyph">{it.icon}</span>
          <span className="dicon-label">{it.label}</span>
        </motion.button>
      ))}
    </div>
  );
}