"use client";

import { useEffect, useRef, useState } from "react";
import { useDesktop } from "@/components/DesktopContext";

interface Line {
  text: string;
  cls?: string;
}

const HELP = `Available commands:
  help            show this list
  whoami          who is this
  neofetch        system info
  about           education & focus
  projects        project overview
  stack           tools of the trade
  contact         reach me
  open <app>      launch an app (story, projects, stack, assistant, resume, terminal, calculator, snake, lab…)
  ls              list installed apps
  date            current date & time
  echo <text>     repeat after me
  clear           clear the screen
  sudo <cmd>      nice try
  matrix          wake up, neo…`;

const APPS_ALIAS: Record<string, string> = {
  terminal: "terminal",
  calculator: "calculator",
  calc: "calculator",
  snake: "snake",
  projects: "projects",
  stack: "stack",
  capabilities: "capabilities",
  lab: "lab",
  certificates: "certificates",
  about: "about",
  experience: "experience",
  contact: "contact",
  profile: "profile",
  assistant: "assistant",
  ai: "assistant",
  resume: "resume",
  cv: "resume",
  story: "story",
};

export default function AppTerminal() {
  const { openApp } = useDesktop();
  const [lines, setLines] = useState<Line[]>([
    { text: "PORTFOLIO_OS 3.0 — Terminal.app", cls: "muted" },
    { text: "Type 'help' to see available commands.", cls: "muted" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const push = (text: string, cls?: string) =>
      setLines((ls) => [...ls, { text, cls }]);
    if (cmd) setHistory((h) => [cmd, ...h.slice(0, 49)]);
    setHistIdx(-1);

    const [name, ...args] = cmd.split(/\s+/);
    switch (name) {
      case "":
        return;
      case "help":
        HELP.split("\n").forEach((l) => push(l));
        return;
      case "whoami":
        push("fikri_binaul_umah — Embedded Systems · IoT · AI/CV · Research");
        return;
      case "about":
        push("Computer Engineering Technology @ IPB University · GPA 3.62");
        push("Focus: Embedded Systems, IoT, Applied Computer Vision", "accent");
        return;
      case "projects":
        push("8 projects shipped — run 'open projects' to browse the workshop.");
        return;
      case "stack":
        push("ESP32 · Arduino · Python · YOLO · OpenCV · Laravel · Firebase · React · Next.js");
        return;
      case "contact":
        push("✉ contact@fikribinaulumah.com", "accent");
        push("in/fikribinaulumah · github.com/FikriBinaul");
        return;
      case "ls":
        push(Object.keys(APPS_ALIAS).filter((a, i, arr) => arr.indexOf(a) === i).join("  "));
        return;
      case "date":
        push(new Date().toString());
        return;
      case "echo":
        push(args.join(" ") || "");
        return;
      case "clear":
        setLines([]);
        return;
      case "open": {
        const id = APPS_ALIAS[args[0]?.toLowerCase() ?? ""];
        if (id) {
          push(`Launching ${id}…`, "accent");
          openApp(id);
        } else {
          push(`open: unknown app '${args[0] ?? ""}' — try 'ls'`, "err");
        }
        return;
      }
      case "sudo":
        push("fikri is not in the sudoers file. This incident will be reported. ☕", "err");
        return;
      case "matrix":
        push("Wake up, Neo… The Matrix has you.", "accent");
        push("Follow the white rabbit. 🐇");
        return;
      case "neofetch":
        [
          "        ██╗   ██╗ ██████╗ ███████╗    fikri@portfolio-os",
          "        ╚██╗ ██╔╝██╔═══██╗██╔════╝    ───────────────────",
          "         ╚████╔╝ ██║   ██║█████╗      OS: Portfolio OS 3.0",
          "          ╚██╔╝  ██║   ██║██╔══╝      Host: FBU · IPB University",
          "           ██║   ╚██████╔╝███████╗    Uptime: 127d 04:12:xx",
          "           ╚═╝    ╚═════╝ ╚══════╝    Shell: bash 5.2",
          "                                      Location: Bogor, ID 🇮🇩",
        ].forEach((l) => push(l, "neofetch"));
        return;
      default:
        push(`command not found: ${name} — try 'help'`, "err");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const c = input;
      setLines((ls) => [...ls, { text: `$ ${c}`, cls: "prompt" }]);
      setInput("");
      run(c);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      if (history[idx]) {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  };

  return (
    <div className="app-terminal" onClick={() => inputRef.current?.focus()}>
      <div className="term-out" ref={bodyRef}>
        {lines.map((l, i) => (
          <div key={i} className={`term-line ${l.cls ?? ""}`}>
            {l.text}
          </div>
        ))}
      </div>
      <div className="term-in-row">
        <span className="term-dollar">$</span>
        <input
          ref={inputRef}
          className="term-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="type a command…"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal command input"
        />
      </div>
    </div>
  );
}