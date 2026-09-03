/* ===========================================================
   TIME MACHINE — era snapshots of the portfolio
   Each era restyles the desktop, retints the wallpaper, filters
   the dock/apps, and swaps in year-accurate profile copy.
   =========================================================== */

export type EraId = 2023 | 2024 | 2025 | 2026 | "future";

export const ERA_ORDER: EraId[] = [2023, 2024, 2025, 2026, "future"];

export const DEFAULT_ERA: EraId = 2026;

export const eraYear = (e: EraId): number => (e === "future" ? Infinity : e);

export const eraLabel = (e: EraId): string => (e === "future" ? "FUTURE" : String(e));

export interface EraMeta {
  label: string;
  chip: string;
  theme: string;
  blurb: string;
  lede: string;
  facts: string[];
  roles: string[];
}

export const ERA_META: Record<EraId, EraMeta> = {
  2023: {
    label: "Signal Origins",
    chip: "2023",
    theme: "ember",
    blurb: "First breadboard. First ESP32 flash. FarmShield leaves the bench.",
    lede: "The origin signal: studying Computer Engineering at IPB and wiring up my first ESP32 in the dorm — by year-end FarmShield shipped as my first shipped sensor system.",
    facts: ["IPB · Computer Eng. Tech", "First breadboard · 2021", "FarmShield shipped", "Electronics self-built"],
    roles: ["Electronics Tinkerer", "IoT Student", "First Firmware Writer", "Breadboard Loyalist"],
  },
  2024: {
    label: "Swarm Season",
    chip: "2024",
    theme: "aqua",
    blurb: "Lecturer research: Swarm Aerator — ESP32 nodes that think together.",
    lede: "Swarm season: I joined an IPB lecturer research project and co-built Swarm Aerator — distributed ESP32 aeration nodes that cooperate and decide with Random Forest.",
    facts: ["IPB · GPA 3.62", "Swarm Aerator · research", "HAKI copyright filed", "Aquaculture IoT"],
    roles: ["Swarm Researcher", "Aerator Architect", "Distributed IoT Builder", "Aqua Systems"],
  },
  2025: {
    label: "Field Deployments",
    chip: "2025",
    theme: "leaf",
    blurb: "SENTRY, Smart Door Lock & SIRO — systems left the bench.",
    lede: "Deployment year: SENTRY vision access control, Smart Door Lock built at the UT Digital Hackathon, and SIRO irrigation in the field — the systems left the bench.",
    facts: ["7 systems shipped", "UT Digital Hackathon", "YOLO + OpenCV in the field", "CCNA networking"],
    roles: ["AgriTech Engineer", "Vision Gatekeeper", "Hackathon Builder", "Field Systems"],
  },
  2026: {
    label: "Research Year",
    chip: "2026",
    theme: "indigo",
    blurb: "BRIN research intern — plantar pressure, FSR arrays, gait science.",
    lede: "Computer Engineering student building embedded systems, IoT platforms, and applied computer vision — from ESP32 firmware to research deployed with BRIN and IPB University.",
    facts: ["GPA 3.62 · IPB", "BRIN Research Intern", "8+ IoT · AI Projects", "Open to remote"],
    roles: ["Embedded Systems Engineer", "Electronics & Hardware Engineer", "Firmware Developer", "IoT Engineer", "AI Engineer", "Research Engineer", "Robotics Enthusiast"],
  },
  future: {
    label: "Roadmap OS",
    chip: "FUTURE",
    theme: "neon",
    blurb: "Designing the next board — gait labs, robotics, and open calls.",
    lede: "2026 → NEXT: the FSR plantar pipeline is heading toward gait research, and the next boards are already on the bench. If you're building hardware teams — this is where we talk.",
    facts: ["Designing next systems", "Open to internships", "Robotics on the roadmap", "Let's build together"],
    roles: ["Roadmap Architect", "Gait & Rehab Researcher", "Hardware Dreamer", "Open to the next board"],
  },
};

/** The desktop year shown on each era's wallpaper chip / menubar hint. */
export const eraFromChip = (chip: string): EraId | null => {
  const found = ERA_ORDER.find((e) => eraLabel(e) === chip.toUpperCase());
  return found ?? null;
};

/* ---------------------------------------------------------
   App availability per era ("app shipped in year X").
   Windows for apps not yet released close when you time-travel.
   --------------------------------------------------------- */
const APP_SINCE: Record<string, number> = {
  profile: 2023,
  about: 2023,
  contact: 2023,
  terminal: 2023,
  calculator: 2023,
  experience: 2024,
  projects: 2024,
  stack: 2024,
  certificates: 2024,
  leadership: 2024,
  notes: 2024,
  capabilities: 2025,
  lab: 2025,
  snake: 2025,
  assistant: 2026,
  resume: 2026,
};

export const appAllowed = (appId: string, era: EraId): boolean =>
  (APP_SINCE[appId] ?? 2023) <= eraYear(era);
