"use client";

import { useEffect, useRef, useState } from "react";

/** Activity-Monitor-style widget — jittering CPU/RAM bars + live sparkline. */
export default function WidgetSysMon() {
  const [cpu, setCpu] = useState(34);
  const [mem, setMem] = useState(58);
  const [net, setNet] = useState(12.4);
  const [hist, setHist] = useState<number[]>(() => Array.from({ length: 24 }, (_, i) => 26 + ((i * 7) % 20)));
  const cpuRef = useRef(cpu);
  useEffect(() => {
    cpuRef.current = cpu;
  }, [cpu]);

  useEffect(() => {
    const id = setInterval(() => {
      setCpu((c) => Math.min(96, Math.max(8, c + (Math.random() - 0.5) * 26)));
      setMem((m) => Math.min(92, Math.max(30, m + (Math.random() - 0.5) * 8)));
      setNet((n) => Math.max(0.4, +(n + (Math.random() - 0.5) * 6).toFixed(1)));
      setHist((h) => [...h.slice(1), Math.round(cpuRef.current)]);
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const points = hist
    .map((v, i) => `${(i / (hist.length - 1)) * 100},${28 - (v / 100) * 28}`)
    .join(" ");

  return (
    <div className="desk-widget sysmon-widget">
      <div className="dw-head">
        <span className="dw-label">activity monitor</span>
        <span className="dw-live" />
      </div>
      <div className="sm-row">
        <span className="sm-name">CPU</span>
        <div className="sm-track">
          <div className="sm-fill cpu" style={{ width: `${cpu}%` }} />
        </div>
        <span className="sm-val">{Math.round(cpu)}%</span>
      </div>
      <div className="sm-row">
        <span className="sm-name">MEM</span>
        <div className="sm-track">
          <div className="sm-fill mem" style={{ width: `${mem}%` }} />
        </div>
        <span className="sm-val">{Math.round(mem)}%</span>
      </div>
      <div className="sm-row">
        <span className="sm-name">NET</span>
        <div className="sm-track">
          <div className="sm-fill net" style={{ width: `${Math.min(100, net * 6)}%` }} />
        </div>
        <span className="sm-val">{net.toFixed(1)}M</span>
      </div>
      <div className="sm-spark">
        <svg viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={points} fill="none" stroke="#64D2FF" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="sm-foot">
        <span>cores 2</span>
        <span>devices 12</span>
      </div>
    </div>
  );
}