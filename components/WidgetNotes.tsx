/** Sticky note widget — pinned to the desktop like a real bench note. */
export default function WidgetNotes() {
  return (
    <div className="desk-widget notes-widget">
      <div className="note-pin" />
      <div className="dw-head">
        <span className="dw-label">bench notes</span>
      </div>
      <ul className="note-list">
        <li>
          <span className="note-tag">FIXME</span> swarm_fw v2.3 — deploy tonight
        </li>
        <li>
          <span className="note-tag">CAL</span> FSR array zero-offset @ BRIN
        </li>
        <li>
          <span className="note-tag">TODO</span> ship README before Friday demo
        </li>
        <li>
          <span className="note-tag done">DONE</span> plantar COP pipeline v1
        </li>
      </ul>
    </div>
  );
}