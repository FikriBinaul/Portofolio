"use client";

import { useEffect, useState } from "react";

interface Wx {
  temp: number;
  code: number;
  hum: number;
  live: boolean;
}

const WMO: Record<number, { icon: string; label: string }> = {
  0: { icon: "☀", label: "Clear sky" },
  1: { icon: "◐", label: "Mostly clear" },
  2: { icon: "☁", label: "Partly cloudy" },
  3: { icon: "☁", label: "Overcast" },
  45: { icon: "≋", label: "Foggy" },
  48: { icon: "≋", label: "Icy fog" },
  51: { icon: "☂", label: "Light drizzle" },
  53: { icon: "☂", label: "Drizzle" },
  55: { icon: "☂", label: "Heavy drizzle" },
  61: { icon: "☂", label: "Light rain" },
  63: { icon: "☂", label: "Rain" },
  65: { icon: "☂", label: "Heavy rain" },
  71: { icon: "❄", label: "Light snow" },
  73: { icon: "❄", label: "Snow" },
  75: { icon: "❄", label: "Heavy snow" },
  80: { icon: "☂", label: "Rain showers" },
  81: { icon: "☂", label: "Rain showers" },
  82: { icon: "☂", label: "Violent showers" },
  95: { icon: "⛈", label: "Thunderstorm" },
  96: { icon: "⛈", label: "Storm + hail" },
  99: { icon: "⛈", label: "Storm + hail" },
};

const FALLBACK: Wx = { temp: 27, code: 2, hum: 74, live: false };

/** Weather widget — Bogor conditions via Open-Meteo, graceful offline fallback. */
export default function WidgetWeather() {
  const [wx, setWx] = useState<Wx>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 8000);
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-6.5971&longitude=106.8060&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FJakarta",
          { signal: ctrl.signal }
        );
        clearTimeout(t);
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (!cancelled) {
          setWx({
            temp: Math.round(data.current?.temperature_2m ?? 27),
            code: data.current?.weather_code ?? 2,
            hum: Math.round(data.current?.relative_humidity_2m ?? 74),
            live: true,
          });
        }
      } catch {
        if (!cancelled) setWx((w) => ({ ...w, live: false }));
      }
    };
    load();
    const id = setInterval(load, 10 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const w = WMO[wx.code] ?? { icon: "☁", label: "Unknown" };

  return (
    <div className="desk-widget weather-widget">
      <div className="dw-head">
        <span className="dw-label">weather · bogor</span>
        <span className="wx-badge">{wx.live ? "LIVE" : "SIM"}</span>
      </div>
      <div className="wx-main">
        <span className="wx-icon">{w.icon}</span>
        <div>
          <div className="wx-temp">{wx.temp}°C</div>
          <div className="wx-label">{w.label}</div>
        </div>
      </div>
      <div className="wx-meta">
        <span>HUMIDITY {wx.hum}%</span>
        <span>ID · S6.60 E106.80</span>
      </div>
    </div>
  );
}