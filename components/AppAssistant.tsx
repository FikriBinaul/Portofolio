"use client";

import { useEffect, useRef, useState } from "react";
import {
  CAPABILITIES,
  CERTIFICATES,
  EXPERIENCE,
  PROJECTS,
  STACK_GROUPS,
} from "@/lib/data";

interface Msg {
  role: "user" | "bot";
  text: string;
}

const SUGGESTIONS = [
  "What projects have you shipped?",
  "Tell me about the BRIN internship",
  "Which tools do you use?",
  "Show me your certifications",
  "How do I contact you?",
  "Fun fact about you",
];

function projectsText(): string {
  return PROJECTS.map((p, i) => `${i + 1}. ${p.title} — ${p.catLabel.split("•")[0].trim()}`).join("\n");
}

function projectDetail(q: string): string | null {
  const map = PROJECTS.map((p) => ({ p, keys: [p.title.toLowerCase(), p.glyph.toLowerCase()] }));
  for (const { p, keys } of map) {
    if (keys.some((k) => q.includes(k))) {
      return `${p.title} — ${p.catLabel}\n${p.description}\nStack: ${p.tags.join(", ")}`;
    }
  }
  return null;
}

function answer(q: string): string {
  const s = q.toLowerCase();
  const has = (...words: string[]) => words.some((w) => s.includes(w));

  const specific = projectDetail(s);
  if (specific) return specific;

  if (has("hello", "halo", "hi ", "hey", "assalamu")) {
    return "Hello! 👋 I'm the Project Assistant — I answer from Fikri's actual profile, on-device. Try asking about his projects, the BRIN internship, skills, or how to reach him.";
  }
  if (has("brin", "intern", "internship", "research", "plantar", "pressure", "magang")) {
    return `2026 — Research Intern at BRIN (National Research and Innovation Agency):\nBuilt a Smart Plantar Pressure Monitoring System — distributed FSR sensor arrays + ESP32 + Firebase, with Center-of-Pressure analysis for gait assessment and rehabilitation.\n\nEarlier, as a student researcher on an IPB lecturer project, he co-developed Swarm Aerator — a distributed ESP32 aeration swarm with Random Forest intelligence (registered as HAKI copyright).`;
  }
  if (has("experience", "job", "work", "career", "role")) {
    return EXPERIENCE.map((e) => `${e.date} · ${e.role} — ${e.org}`).join("\n");
  }
  if (has("project", "built", "build", "ship", "work on", "portfolio")) {
    return `8 projects shipped, from aquaculture to healthcare:\n${projectsText()}\n\nAsk about any of them by name for the full story.`;
  }
  if (has("education", "study", "ipb", "gpa", "campus", "school", "university")) {
    return "Computer Engineering Technology, Sekolah Vokasi — IPB University.\nGPA 3.62 / 4.00 · Focus: Embedded Systems, IoT & Applied Computer Vision for industrial and agricultural automation.";
  }
  if (has("who", "name", "profile", "summary", "yourself", "fikri", "introduce")) {
    return `Fikri Binaul Umah — Computer Engineering Technology student at IPB University (GPA 3.62/4.00), Bogor, Indonesia.\n\nHe builds systems from sensor to decision: ESP32 firmware, Python intelligence (OpenCV/YOLO, Random Forest), and React dashboards. Currently a research intern at BRIN — open to internships & remote roles.`;
  }
  if (has("skill", "stack", "tech", "tool", "language", "framework", "know")) {
    const onDev = STACK_GROUPS[0].items.map((i) => i.label).join(", ");
    const around = STACK_GROUPS[1].items.map((i) => i.label).join(", ");
    return `On the device: ${onDev}.\nEverything around it: ${around}.\n\nPlus networking (CCNA-level) and full-system thinking: capabilities like ${CAPABILITIES.map((c) => c.title).slice(0, 3).join(", ").toLowerCase()}.`;
  }
  if (has("certif", "award", "haki", "cisco", "ccna", "cyber", "bnsp", "sertifikat")) {
    const top = CERTIFICATES.slice(0, 6);
    return `15 credentials & awards. Highlights:\n${top.map((c) => `• ${c.title} — ${c.issuer.split("·")[0].trim()}`).join("\n")}`;
  }
  if (has("leadership", "org", "nasapala", "volunteer", "event", "beyond", "semak")) {
    return "Beyond the lab: NASAPALA outdoor-community member, department Event Chairperson, Field Coordinator at VISCO — and he presented Swarm Aerator research with his supervising lecturer.";
  }
  if (has("contact", "email", "github", "linkedin", "hire", "remote", "reach", "phone")) {
    return "✉ contact@fikribinaulumah.com\n☎ +62 858-8308-6119\n⚲ Bogor, Indonesia — open to remote\n\nLinkedIn → linkedin.com/in/fikribinaulumah\nGitHub → github.com/FikriBinaul";
  }
  if (has("location", "bogor", "indonesia", "where")) {
    return "Bogor, Indonesia (West Java) — open to remote roles worldwide.";
  }
  if (has("fun", "hobby", "fact", "coffee", "interest")) {
    return "Fun facts: coffee-fueled firmware debugging (lo-fi on), robotics enthusiast since day one of the ESP32, and he thinks every problem starts as a schematic. Calibration-duck approved 🦆";
  }
  if (has("capabilit", "what can", "do for", "service", "offer")) {
    return CAPABILITIES.map((c) => `• ${c.title} — ${c.desc}`).join("\n");
  }
  if (has("thank")) return "You're welcome! Anything else about Fikri you'd like to know?";
  if (has("help")) return "Try asking: projects · BRIN internship · skills · certifications · contact · leadership · fun fact. Or name a project, like \"Swarm Aerator\".";
  return `I don't have that in my knowledge base yet — but I can tell you about his projects, experience, skills, certifications, leadership, and contact. Type "help" for ideas.`;
}

/** Assistant.app — on-device AI that answers from the profile knowledge base. */
export default function AppAssistant() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi, I'm Fikri's Project Assistant ✦ — a lightweight AI that runs right here in your browser and answers from his real profile. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, thinking]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || thinking) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      setMsgs((m) => [...m, { role: "bot", text: answer(text) }]);
      setThinking(false);
    }, 650 + Math.random() * 450);
  };

  return (
    <div className="app-chat">
      <div className="chat-head">
        <span className="chat-avatar">✦</span>
        <div className="chat-id">
          <b>Project Assistant</b>
          <span className="chat-status">
            <i className="dot" /> online · on-device AI
          </span>
        </div>
        <span className="chat-model">FBU-1B · knowledge base v3.0</span>
      </div>

      <div className="chat-body" ref={bodyRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`chat-row ${m.role}`}>
            <div className="chat-bubble">{m.text}</div>
          </div>
        ))}
        {thinking && (
          <div className="chat-row bot">
            <div className="chat-bubble typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      <div className="chat-suggest" aria-hidden={msgs.length > 1}>
        {SUGGESTIONS.map((sg) => (
          <button key={sg} onClick={() => send(sg)}>
            {sg}
          </button>
        ))}
      </div>

      <div className="chat-in">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask about Fikri's projects, experience, skills…"
          aria-label="Ask the assistant"
          autoComplete="off"
        />
        <button className="chat-send" onClick={() => send(input)} disabled={!input.trim() || thinking}>
          ➤
        </button>
      </div>
    </div>
  );
}