"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

const MENUBAR_H = 46;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAbout: () => void;
  onCleanup: () => void;
  onTour: () => void;
}

/** Right-click desktop menu. */
export default function ContextMenu({ x, y, onClose, onAbout, onCleanup, onTour }: ContextMenuProps) {
  useEffect(() => {
    const close = () => onClose();
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", esc);
    window.addEventListener("blur", close);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", esc);
      window.removeEventListener("blur", close);
    };
  }, [onClose]);

  const left = clamp(x, 8, window.innerWidth - 230);
  const top = clamp(y, MENUBAR_H + 8, window.innerHeight - 170);

  return (
    <motion.div
      className="ctx-menu"
      style={{ left, top }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.12 }}
      onPointerDown={(e) => e.stopPropagation()}
      role="menu"
    >
      <button role="menuitem" onClick={() => { onAbout(); onClose(); }}>
        <span className="ctx-ic">ℹ</span> About This Mac
      </button>
      <button role="menuitem" onClick={() => { onCleanup(); onClose(); }}>
        <span className="ctx-ic">⤢</span> Clean Up Windows
      </button>
      <button role="menuitem" onClick={() => { onTour(); }}>
        <span className="ctx-ic">📍</span> Take the tour
      </button>
      <hr />
      <button role="menuitem" onClick={() => location.reload()}>
        <span className="ctx-ic">↻</span> Reload Desktop
      </button>
    </motion.div>
  );
}