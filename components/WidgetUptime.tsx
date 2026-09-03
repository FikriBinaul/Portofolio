"use client";

import { useEffect, useState } from "react";

const BASE_UPTIME = 127 * 86400 + 4 * 3600 + 11 * 60 + 9; // 127d 04:11:09

/** System status widget — ticking uptime, kernel, node. */
export default function WidgetUptime() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const total = BASE_UPTIME + elapsed;
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="desk-widget uptime-widget">
      <div className="dw-head">
        <span className="dw-label">system</span>
        <span className="status-ok">nominal</span>
      </div>
      <div className="up-host">PORTFOLIO_OS 3.0</div>
      <div className="up-uptime">
        {d}d {pad(h)}:{pad(m)}:{pad(s)}
      </div>
      <div className="up-grid">
        <span>KERNEL</span>
        <b>fb-3.0</b>
        <span>SESSIONS</span>
        <b>1</b>
        <span>NODE</span>
        <b>BOGOR.ID</b>
      </div>
    </div>
  );
}