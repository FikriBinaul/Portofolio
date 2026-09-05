"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SPOTLIGHT_DESTINATIONS } from "@/lib/data";

interface SpotlightProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (goto: string) => void;
}

/** Spotlight search — Cmd/Ctrl+K across sections, projects, and easter eggs. */
export default function Spotlight({ open, onClose, onNavigate }: SpotlightProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const list = SPOTLIGHT_DESTINATIONS;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (d) => d.title.toLowerCase().includes(q) || d.sub.toLowerCase().includes(q)
    );
  }, [query, list]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const select = useCallback(
    (i: number) => {
      const item = filtered[i];
      if (!item) return;
      if (item.goto) onNavigate(item.goto);
      onClose();
    },
    [filtered, onClose, onNavigate]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="spotlight-backdrop open"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="spotlight-panel"
            initial={{ opacity: 0, scale: 0.94, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <div className="spotlight-input-row">
              <span className="icon">⌕</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections, projects, certificates…"
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, filtered.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    select(active);
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    onClose();
                  }
                }}
              />
              <kbd>ESC</kbd>
            </div>
            <div className="spotlight-results">
              {filtered.length === 0 ? (
                <div className="spotlight-empty">No results. Try “projects” or “contact”.</div>
              ) : (
                filtered.map((d, i) => (
                  <motion.button
                    key={d.title}
                    type="button"
                    className={`spotlight-item ${i === active ? "active" : ""}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => select(i)}
                  >
                    <span className="si-icon" style={{ background: d.color }}>
                      {d.icon}
                    </span>
                    <span className="si-meta">
                      <span className="si-title">{d.title}</span>
                      <br />
                      <span className="si-sub">{d.sub}</span>
                    </span>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}