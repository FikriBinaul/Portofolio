"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import type { AppDef } from "@/lib/apps";

export interface WinState {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  prev?: { x: number; y: number; w: number; h: number };
}

const MENUBAR_H = 46;
const DOCK_H = 96;
const MIN_W = 360;
const MIN_H = 260;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

interface WindowProps {
  app: AppDef;
  state: WinState;
  focused: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
}

/** A real desktop window: drag, resize, traffic lights, focus management. */
export default function Window({
  app,
  state,
  focused,
  onFocus,
  onClose,
  onMinimize,
  onToggleMax,
  onMove,
  onResize,
}: WindowProps) {
  const layout = useRef(state);
  layout.current = state;
  const [dragging, setDragging] = useState(false);

  // --- drag by titlebar ---
  const dragStart = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  const onTitleDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragStart.current = { px: e.clientX, py: e.clientY, ox: state.x, oy: state.y };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic or released pointer — ignore */
    }
    setDragging(true);
    onFocus();
  };
  const onTitleMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragStart.current;
    if (!d) return;
    const s = layout.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const nx = clamp(d.ox + e.clientX - d.px, -(s.w - 140), vw - 140);
    const ny = clamp(d.oy + e.clientY - d.py, MENUBAR_H + 4, vh - DOCK_H - 50);
    onMove(nx, ny);
  };
  const onTitleUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current = null;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  // --- resize by corner handle ---
  const resizeStart = useRef<{ px: number; py: number; ow: number; oh: number } | null>(null);
  const onResizeDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    resizeStart.current = { px: e.clientX, py: e.clientY, ow: state.w, oh: state.h };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    onFocus();
  };
  const onResizeMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = resizeStart.current;
    if (!d) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const nw = clamp(d.ow + e.clientX - d.px, MIN_W, vw - 16);
    const nh = clamp(d.oh + e.clientY - d.py, MIN_H, vh - MENUBAR_H - DOCK_H - 30);
    onResize(nw, nh);
  };
  const onResizeUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    resizeStart.current = null;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const classes = [
    "win",
    focused ? "active" : "inactive",
    state.minimized ? "minimized" : "",
    dragging ? "dragging" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className={classes}
      style={{ left: state.x, top: state.y, width: state.w, height: state.h, zIndex: state.z }}
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{
        opacity: state.minimized ? 0 : 1,
        scale: state.minimized ? 0.04 : 1,
        y: state.minimized ? 380 : 0,
      }}
      exit={{ opacity: 0, scale: 0.96, y: 6 }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      onPointerDown={() => {
        if (!focused) onFocus();
      }}
      onDoubleClick={(e) => {
        if ((e.target as HTMLElement).closest(".win-titlebar")) onToggleMax();
      }}
    >
      <div
        className="win-titlebar"
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={onTitleUp}
        onPointerCancel={onTitleUp}
      >
        <div className="traffic">
          <button className="tdot r" aria-label="Close window" onClick={onClose} />
          <button className="tdot y" aria-label="Minimize window" onClick={onMinimize} />
          <button className="tdot g" aria-label="Maximize window" onClick={onToggleMax} />
        </div>
        <div className="win-title">{app.title}</div>
      </div>
      <div className="win-body">
        <div className="app-inner">
          <app.content />
        </div>
      </div>
      <div
        className="win-resize"
        aria-hidden="true"
        onPointerDown={onResizeDown}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeUp}
        onPointerCancel={onResizeUp}
      />
    </motion.div>
  );
}