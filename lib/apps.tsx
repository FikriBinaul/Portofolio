import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/* ===========================================================
   APP REGISTRY — code-split with next/dynamic
   Each "application" ships as its own JS chunk and is only
   downloaded when its window is actually opened. The initial
   bundle carries just the desktop shell (menubar, dock,
   windows, widgets), which keeps First Load JS small.
   =========================================================== */

function AppLoading() {
  return (
    <div className="app-loading" role="status" aria-label="Loading application">
      <span className="app-loading-spin" />
    </div>
  );
}

/** next/dynamic requires a literal options object — build it per app. */
function lazy(load: () => Promise<{ default: ComponentType }>) {
  return dynamic(load, { loading: AppLoading, ssr: false });
}

export interface AppDef {
  id: string;
  title: string;
  icon: string;
  c1: string;
  c2: string;
  w: number;
  h: number;
  /** Lazily-loaded window content (own JS chunk). */
  content: ComponentType;
}

/** Every launchable "application" on the desktop. */
export const APPS: AppDef[] = [
  { id: "profile", title: "Fikri.app — System Profile", icon: "⌂", c1: "#7C6CFF", c2: "#4d3ffb", w: 720, h: 640, content: lazy(() => import("@/components/Hero")) },
  { id: "about", title: "Fikri.app — About", icon: "☺", c1: "#64D2FF", c2: "#2a95d1", w: 980, h: 660, content: lazy(() => import("@/components/About")) },
  { id: "experience", title: "Calendar.app — Experience", icon: "📅", c1: "#32D74B", c2: "#1a9c34", w: 660, h: 480, content: lazy(() => import("@/components/Experience")) },
  { id: "projects", title: "Workshop.app — Projects", icon: "⚙", c1: "#FF6B4A", c2: "#e04b2c", w: 1020, h: 700, content: lazy(() => import("@/components/Projects")) },
  { id: "stack", title: "Bench.app — Stack", icon: "▦", c1: "#FFD426", c2: "#e0a800", w: 920, h: 620, content: lazy(() => import("@/components/Stack")) },
  { id: "capabilities", title: "System Settings — Capabilities", icon: "⚑", c1: "#a78bfa", c2: "#6d4fe0", w: 900, h: 580, content: lazy(() => import("@/components/Capabilities")) },
  { id: "lab", title: "Machines.app — Hardware Lab", icon: "🛠", c1: "#FF9F0A", c2: "#c46a00", w: 900, h: 580, content: lazy(() => import("@/components/Machines")) },
  { id: "certificates", title: "Finder — Certificates", icon: "◧", c1: "#7C6CFF", c2: "#4d3ffb", w: 840, h: 600, content: lazy(() => import("@/components/Certificates")) },
  { id: "leadership", title: "Photos.app — Beyond the Lab", icon: "🏔", c1: "#64D2FF", c2: "#2a95d1", w: 920, h: 660, content: lazy(() => import("@/components/Leadership")) },
  { id: "contact", title: "Mail.app — Contact", icon: "✉", c1: "#32D74B", c2: "#1a9c34", w: 660, h: 540, content: lazy(() => import("@/components/Contact")) },
  { id: "terminal", title: "Terminal.app", icon: "⌘", c1: "#5E5CE6", c2: "#3634a3", w: 660, h: 460, content: lazy(() => import("@/components/AppTerminal")) },
  { id: "calculator", title: "Calculator.app", icon: "=", c1: "#FF9F0A", c2: "#c46a00", w: 360, h: 500, content: lazy(() => import("@/components/AppCalculator")) },
  { id: "snake", title: "Snake.app — Lab Arcade", icon: "◈", c1: "#30D158", c2: "#1f8f3d", w: 480, h: 560, content: lazy(() => import("@/components/AppSnake")) },
  { id: "notes", title: "Notes.app — About Me", icon: "🗒", c1: "#FFD426", c2: "#d9a400", w: 800, h: 580, content: lazy(() => import("@/components/AppNotes")) },
  { id: "assistant", title: "Assistant.app — AI Project Assistant", icon: "✦", c1: "#a78bfa", c2: "#6d4fe0", w: 760, h: 600, content: lazy(() => import("@/components/AppAssistant")) },
  { id: "resume", title: "Resume.app — Generator", icon: "▤", c1: "#2dd4bf", c2: "#0f766e", w: 880, h: 660, content: lazy(() => import("@/components/AppResume")) },
  { id: "story", title: "Story.app — The Journey", icon: "📖", c1: "#f472b6", c2: "#be185d", w: 860, h: 620, content: lazy(() => import("@/components/AppStory")) },
];

export const APP_BY_ID: Record<string, AppDef> = Object.fromEntries(
  APPS.map((a) => [a.id, a])
);
