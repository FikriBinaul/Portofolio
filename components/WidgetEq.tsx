/** Now-playing equalizer widget — animated bars, lo-fi session. */
export default function WidgetEq() {
  const bars = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="desk-widget eq-widget">
      <div className="dw-head">
        <span className="dw-label">now playing</span>
        <span className="eq-note">♪</span>
      </div>
      <div className="eq-bars">
        {bars.map((i) => (
          <span
            key={i}
            className="eq-bar"
            style={{
              animationDelay: `${(i % 6) * 0.11}s`,
              animationDuration: `${0.7 + (i % 5) * 0.14}s`,
              height: `${34 - (i % 4) * 6}%`,
            }}
          />
        ))}
      </div>
      <div className="eq-track">lo-fi firmware sessions</div>
      <div className="eq-meta">24/7 · mono · 44.1 kHz</div>
    </div>
  );
}