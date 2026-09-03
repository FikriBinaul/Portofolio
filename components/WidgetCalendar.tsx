"use client";

import { useMemo } from "react";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

/** Mini calendar widget — current month, today ringed, Monday-first. */
export default function WidgetCalendar() {
  const { cells, monthLabel, today, events } = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const firstDow = (new Date(y, m, 1).getDay() + 6) % 7;
    const days = new Date(y, m + 1, 0).getDate();
    const blanks: (number | null)[] = Array.from({ length: firstDow }, () => null);
    const nums: (number | null)[] = Array.from({ length: days }, (_, i) => i + 1);
    return {
      cells: [...blanks, ...nums],
      monthLabel: now.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      today: now.getDate(),
      events: ["01", "08", "14", "26"].map(Number),
    };
  }, []);

  return (
    <div className="desk-widget cal-widget">
      <div className="dw-head">
        <span className="dw-label">calendar</span>
        <span className="cal-month">{monthLabel}</span>
      </div>
      <div className="cal-week">
        {WEEKDAYS.map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((d, i) => (
          <div
            key={i}
            className={`cal-cell ${d === null ? "blank" : ""} ${d === today ? "today" : ""} ${
              events.includes(d ?? -1) ? "has-event" : ""
            }`}
          >
            {d ?? ""}
          </div>
        ))}
      </div>
      <div className="cal-foot">
        <span>
          EVENTS <b>{events.length}</b>
        </span>
        <span>
          TODAY <b>{today}</b>
        </span>
      </div>
    </div>
  );
}