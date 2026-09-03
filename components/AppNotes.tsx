"use client";

import { useEffect, useRef, useState } from "react";

interface Note {
  id: string;
  title: string;
  body: string;
}

const STORAGE_KEY = "fbu-notes-v1";

/** Seeded profile notes — the full story of Fikri Binaul Umah. */
const ORIGINAL: Note[] = [
  {
    id: "profile",
    title: "01 · System Profile",
    body: `FIKRI BINAUL UMAH
Embedded Systems · IoT · AI/CV · Research Engineer

Computer Engineering Technology student at IPB University — GPA 3.62 / 4.00 — based in Bogor, Indonesia. I build systems that start with a sensor and end with a decision: firmware on ESP32, intelligence in Python, dashboards in React.

Current status: 2026 research internship at BRIN (National Research and Innovation Agency) · open to internships & remote roles.

"From sensors to systems — one deploy at a time."`,
  },
  {
    id: "research",
    title: "02 · Research & Experience",
    body: `2026 — Research Intern, BRIN (National Research and Innovation Agency)
  ▸ Smart Plantar Pressure Monitoring System — distributed FSR sensor array + ESP32 + IoT + Firebase, with Center-of-Pressure analysis for gait assessment & rehabilitation.

2021 — Student Researcher, lecturer research project @ IPB University
  ▸ Swarm Aerator — autonomous swarm of ESP32 aerator nodes with distributed scheduling and Random Forest intelligence. Registered as intellectual property (HAKI copyright).

2021 — Technical Support Engineer @ Top City Comp
2024 — Member @ Semak Belukar East`,
  },
  {
    id: "projects",
    title: "03 · Projects (8 shipped)",
    body: `1. Swarm Aerator — IoT/Research · ESP32 swarm aeration, Random Forest. HAKI registered.
2. Smart Plantar Pressure Monitoring — Healthcare AI @ BRIN · FSR arrays, COP analysis.
3. FarmShield — Agriculture IoT · ESP32 crop-protection sensor network.
4. MataGunung — Computer Vision · YOLO + OpenCV terrain monitoring.
5. CHOP-X — Automation · Arduino closed-loop control system.
6. SENTRY — Security · face-recognition door access with ESP32 actuation.
7. Smart Door Lock — Access Control · RFID + Firebase (UT Digital Hackathon 2025).
8. SIRO — Smart Irrigation · soil-moisture scheduling, MySQL dashboard.`,
  },
  {
    id: "skills",
    title: "04 · Skills & Stack",
    body: `ON THE DEVICE
  ▸ ESP32 / Arduino firmware (C, C++)
  ▸ Sensor interfacing, real-time control loops
  ▸ Git version control

EVERYTHING AROUND IT
  ▸ Python: OpenCV, YOLO, Random Forest
  ▸ Firebase · MySQL · Laravel
  ▸ React / Next.js dashboards & control interfaces
  ▸ Networking: CCNA-level routing, switching, security

Research skills: experimental design, technical writing, research presentations.`,
  },
  {
    id: "certs",
    title: "05 · Certificates & Awards (15)",
    body: `INTELLECTUAL PROPERTY
  ▸ HAKI Copyright — Water Quality Monitoring System (Swarm Aerator), registered May 2026.

RESEARCH TRAINING (BRIN)
  ▸ Internship briefing (25h) · Sampling techniques · Reference searching · Scientific poster · 3-minute presentation · Body language — 2026.

CISCO NETWORKING ACADEMY
  ▸ CCNA: Enterprise Networking, Security & Automation (2026)
  ▸ CyberOps Associate (2026) · Network Security (2025)
  ▸ CCNAv7: Introduction to Networks (2023)

PROFESSIONAL COMPETENCY
  ▸ BNSP — Junior Network Administrator (2023)
  ▸ Idenitive — WAN Security Troubleshooting, "Sangat Kompeten" (2023)

AWARDS
  ▸ UT Digital Hackathon 2025 — Certificate of Appreciation
  ▸ 2nd Place, Infographic Competition — Team ThreeCom (Unsika, 2025)`,
  },
  {
    id: "leadership",
    title: "06 · Beyond the Lab",
    body: `NASAPALA — mountain & outdoor community, East (2021 → 2024)
  ▸ Built clear briefings, fast decisions, and a team culture where everyone knows the plan.

Department leadership @ IPB University Vocational School
  ▸ Event Chairperson — led the flagship event end to end, from rundown to stage.
  ▸ Field Coordinator — coordinated the study program's field activities at VISCO.

Research presentation
  ▸ Presented Swarm Aerator results together with the supervising lecturer.

The parts of the job that happen away from a screen.`,
  },
  {
    id: "contact",
    title: "07 · Contact",
    body: `✉ contact@fikribinaulumah.com
☎ +62 858-8308-6119
⚲ Bogor, Indonesia — open to remote

LinkedIn  → linkedin.com/in/fikribinaulumah
GitHub   → github.com/FikriBinaul

Best time to reach me: after the 2am firmware compiles. ☕`,
  },
  {
    id: "fun",
    title: "08 · Fun Facts",
    body: `▸ Coffee-fueled firmware debugging — lo-fi on, distractions off.
▸ Robotics enthusiast since day one of the ESP32.
▸ Thinks in blueprints: every problem starts as a schematic.
▸ Proudly runs this whole portfolio as an operating system.
▸ Calibration duck approved — all sensors are duck-tested. 🦆

TODO:
  [ ] finish this note
  [x] ship Portfolio OS 3.0
  [x] eat the snake's food`,
  },
];

function loadNotes(): Note[] {
  if (typeof window === "undefined") return ORIGINAL.map((n) => ({ ...n }));
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Note[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return ORIGINAL.map((n) => ({ ...n }));
}

/** Notes.app — editable, autosaved, pre-seeded with the full self story. */
export default function AppNotes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [sel, setSel] = useState(0);
  const [saved, setSaved] = useState(true);
  const timer = useRef<number | null>(null);
  const active = notes[Math.min(sel, notes.length - 1)];

  useEffect(() => {
    if (saved) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch {
        /* private mode — ignore */
      }
      setSaved(true);
    }, 600);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [notes, saved]);

  const updateActive = (patch: Partial<Note>) => {
    setNotes((ns) => ns.map((n, i) => (i === sel ? { ...n, ...patch } : n)));
    setSaved(false);
  };

  const addNote = () => {
    const n: Note = { id: `n${Date.now()}`, title: "Untitled note", body: "" };
    setNotes((ns) => [...ns, n]);
    setSel(notes.length);
    setSaved(false);
  };

  const deleteActive = () => {
    if (!active) return;
    const idx = sel;
    setNotes((ns) => ns.filter((_, i) => i !== idx));
    setSel(Math.max(0, idx - 1));
    setSaved(false);
  };

  const resetActive = () => {
    if (!active) return;
    const orig = ORIGINAL.find((o) => o.id === active.id);
    if (orig) updateActive({ title: orig.title, body: orig.body });
  };

  const wordCount = active ? active.body.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="app-notes">
      <div className="notes-side">
        <div className="notes-side-head">
          <span>NOTES · ABOUT ME</span>
          <button className="notes-add" onClick={addNote} aria-label="New note">
            +
          </button>
        </div>
        <div className="notes-list">
          {notes.map((n, i) => (
            <button
              key={n.id}
              className={`note-item ${i === sel ? "active" : ""}`}
              onClick={() => setSel(i)}
            >
              <span className="note-item-title">{n.title}</span>
              <span className="note-item-prev">
                {n.body.replace(/\n+/g, " ").trim() || "Empty note…"}
              </span>
            </button>
          ))}
        </div>
        <div className="notes-side-foot">
          {notes.length} note{notes.length === 1 ? "" : "s"} · localStorage
        </div>
      </div>

      <div className="notes-main">
        {active ? (
          <>
            <input
              className="notes-title-input"
              value={active.title}
              onChange={(e) => updateActive({ title: e.target.value })}
              aria-label="Note title"
            />
            <div className="notes-tools">
              <span className={`notes-saved ${saved ? "" : "dirty"}`}>
                {saved ? "✓ Saved" : "◦ saving…"}
              </span>
              <span className="notes-count">{wordCount} words</span>
              <button className="notes-btn" onClick={resetActive} title="Restore the original content of this note">
                ↺ Reset
              </button>
              <button className="notes-btn danger" onClick={deleteActive} title="Delete this note">
                🗑 Delete
              </button>
            </div>
            <textarea
              className="notes-body"
              value={active.body}
              onChange={(e) => updateActive({ body: e.target.value })}
              placeholder="Start typing — it autosaves…"
              spellCheck={false}
              aria-label="Note body"
            />
          </>
        ) : (
          <div className="notes-empty">
            <div>
              <p>No notes left.</p>
              <button className="btn btn-ghost" onClick={addNote}>
                + Create one
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}