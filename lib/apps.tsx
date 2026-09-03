import type { ComponentType } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Stack from "@/components/Stack";
import Capabilities from "@/components/Capabilities";
import Machines from "@/components/Machines";
import Certificates from "@/components/Certificates";
import Leadership from "@/components/Leadership";
import Contact from "@/components/Contact";
import AppTerminal from "@/components/AppTerminal";
import AppCalculator from "@/components/AppCalculator";
import AppSnake from "@/components/AppSnake";
import AppNotes from "@/components/AppNotes";
import AppAssistant from "@/components/AppAssistant";
import AppResume from "@/components/AppResume";

export interface AppDef {
  id: string;
  title: string;
  icon: string;
  c1: string;
  c2: string;
  w: number;
  h: number;
  content: ComponentType;
}

/** Every launchable "application" on the desktop. */
export const APPS: AppDef[] = [
  { id: "profile", title: "Fikri.app — System Profile", icon: "⌂", c1: "#7C6CFF", c2: "#4d3ffb", w: 720, h: 640, content: Hero },
  { id: "about", title: "Fikri.app — About", icon: "☺", c1: "#64D2FF", c2: "#2a95d1", w: 980, h: 660, content: About },
  { id: "experience", title: "Calendar.app — Experience", icon: "📅", c1: "#32D74B", c2: "#1a9c34", w: 660, h: 480, content: Experience },
  { id: "projects", title: "Workshop.app — Projects", icon: "⚙", c1: "#FF6B4A", c2: "#e04b2c", w: 1020, h: 700, content: Projects },
  { id: "stack", title: "Bench.app — Stack", icon: "▦", c1: "#FFD426", c2: "#e0a800", w: 920, h: 620, content: Stack },
  { id: "capabilities", title: "System Settings — Capabilities", icon: "⚑", c1: "#a78bfa", c2: "#6d4fe0", w: 900, h: 580, content: Capabilities },
  { id: "lab", title: "Machines.app — Hardware Lab", icon: "🛠", c1: "#FF9F0A", c2: "#c46a00", w: 900, h: 580, content: Machines },
  { id: "certificates", title: "Finder — Certificates", icon: "◧", c1: "#7C6CFF", c2: "#4d3ffb", w: 840, h: 600, content: Certificates },
  { id: "leadership", title: "Photos.app — Beyond the Lab", icon: "🏔", c1: "#64D2FF", c2: "#2a95d1", w: 920, h: 660, content: Leadership },
  { id: "contact", title: "Mail.app — Contact", icon: "✉", c1: "#32D74B", c2: "#1a9c34", w: 660, h: 540, content: Contact },
  { id: "terminal", title: "Terminal.app", icon: "⌘", c1: "#5E5CE6", c2: "#3634a3", w: 660, h: 460, content: AppTerminal },
  { id: "calculator", title: "Calculator.app", icon: "=", c1: "#FF9F0A", c2: "#c46a00", w: 360, h: 500, content: AppCalculator },
  { id: "snake", title: "Snake.app — Lab Arcade", icon: "◈", c1: "#30D158", c2: "#1f8f3d", w: 480, h: 560, content: AppSnake },
  { id: "notes", title: "Notes.app — About Me", icon: "🗒", c1: "#FFD426", c2: "#d9a400", w: 800, h: 580, content: AppNotes },
  { id: "assistant", title: "Assistant.app — AI Project Assistant", icon: "✦", c1: "#a78bfa", c2: "#6d4fe0", w: 760, h: 600, content: AppAssistant },
  { id: "resume", title: "Resume.app — Generator", icon: "▤", c1: "#2dd4bf", c2: "#0f766e", w: 880, h: 660, content: AppResume },
];

export const APP_BY_ID: Record<string, AppDef> = Object.fromEntries(
  APPS.map((a) => [a.id, a])
);