"use client";

import { useEffect, useState } from "react";

/** Live desktop clock — ticking time, date, and day-progress. */
export default function WidgetClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return <div className="desk-widget clock-widget" />;
  }

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const dayFrac = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="desk-widget clock-widget">
      <div className="dw-head">
        <span className="dw-label">clock</span>
        <span className="dw-live" />
      </div>
      <div className="clock-time">
        {hh}:{mm}
        <span className="clock-sec">:{ss}</span>
      </div>
      <div className="clock-date">{dateStr}</div>
      <div className="clock-progress">
        <div className="clock-progress-fill" style={{ width: `${dayFrac * 100}%` }} />
      </div>
      <div className="clock-progress-label">{Math.round(dayFrac * 100)}% of day</div>
    </div>
  );
}