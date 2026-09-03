/* ===========================================================
   PORTFOLIO OS — single source of truth for all content
   =========================================================== */

export type ProjectCategory = "iot" | "ai" | "security" | "automation";

export interface Project {
  title: string;
  /** The year this system shipped — used by the Time Machine filter. */
  year?: number;
  category: ProjectCategory;
  catLabel: string;
  glyph: string;
  description: string;
  tags: string[];
  links: { label: string; href: string; internal?: boolean }[];
  img?: string;
}

export interface Certificate {
  cat: string;
  title: string;
  issuer: string;
  date: string;
  img: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "who-am-i", label: "About" },
  { id: "journey", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "stack", label: "Stack" },
  { id: "lab", label: "Lab" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

export const ROLES = [
  "Embedded Systems Engineer",
  "Electronics & Hardware Engineer",
  "Firmware Developer",
  "IoT Engineer",
  "AI Engineer",
  "Research Engineer",
  "Robotics Enthusiast",
];

export const TERMINAL_LINES: { t: string; cls?: string }[] = [
  { t: "$ whoami", cls: "muted" },
  { t: "fikri_binaul_umah" },
  { t: "$ cat role.txt", cls: "muted" },
  { t: "Embedded Systems · IoT · AI/CV · Research", cls: "accent" },
  { t: "$ cat education.txt", cls: "muted" },
  { t: "Computer Engineering Technology — IPB University" },
  { t: "GPA 3.62 / 4.00" },
  { t: "$ cat location.txt", cls: "muted" },
  { t: "Bogor, Indonesia — open to remote", cls: "accent" },
  { t: "$ echo status", cls: "muted" },
  { t: "Building sensors-to-systems, one deploy at a time." },
];

export const STATS: { target: number; suffix: string; label: string }[] = [
  { target: 10, suffix: "+", label: "Projects" },
  { target: 1, suffix: "", label: "Research Project" },
  { target: 1, suffix: "", label: "Research Internship" },
  { target: 5, suffix: "+", label: "Years Technical Experience" },
  { target: 8, suffix: "+", label: "IoT Projects" },
  { target: 3, suffix: "+", label: "Computer Vision Projects" },
  { target: 10, suffix: "+", label: "Certifications & Awards" },
];

export const EXPERIENCE: { date: string; role: string; org: string }[] = [
  { date: "2021", role: "Technical Support Engineer", org: "Top City Comp" },
  { date: "— 2024", role: "Member", org: "Semak Belukar East" },
  { date: "2026", role: "Research Intern", org: "BRIN — National Research and Innovation Agency" },
];

export const PROJECTS: Project[] = [
  {
    title: "Swarm Aerator",
    year: 2024,
    category: "iot",
    catLabel: "LECTURER RESEARCH PROJECT",
    glyph: "SWARM",
    description:
      "Autonomous IoT-based swarm aeration system developed as part of an IPB University lecturer research project. Multiple ESP32-based aerator nodes collaborate using distributed communication, adaptive scheduling, real-time monitoring, and Random Forest-based intelligence to improve aquaculture efficiency.",
    tags: ["ESP32", "IoT", "Distributed Systems", "Random Forest", "Water Quality", "Aquaculture"],
    links: [
      { label: "↗ Project", href: "https://ipb.link/swarmaerator" },
      { label: "↗ HAKI", href: "#certificates", internal: true },
    ],
    img: "/images/swarm-project-photo.jpg",
  },
  {
    title: "Smart Plantar Pressure Monitoring System",
    year: 2026,
    category: "ai",
    catLabel: "HEALTHCARE AI • BRIN INTERNSHIP",
    glyph: "PLANTAR",
    description:
      "Research conducted during my internship at BRIN, developing an intelligent plantar pressure monitoring platform using distributed FSR sensors, ESP32, IoT communication, and Center-of-Pressure analysis for gait assessment and rehabilitation.",
    tags: ["BRIN", "ESP32", "FSR Sensor Array", "Healthcare IoT", "Center of Pressure", "Python", "Firebase"],
    links: [{ label: "↗ Live Demo", href: "https://foot-plantar.vercel.app/" }],
    img: "/images/plantar-project-photo.jpg",
  },
  {
    title: "FarmShield",
    year: 2023,
    category: "iot",
    catLabel: "AGRICULTURE IOT",
    glyph: "FARMSHIELD",
    description:
      "Sensor-driven crop protection system built on ESP32 hardware, continuously reading field conditions through an IoT sensor network and flagging threats before they spread across a crop.",
    tags: ["ESP32", "Sensors", "IoT"],
    links: [{ label: "↗ GitHub", href: "https://github.com/FikriBinaul/farmshield-gen1us" }],
    img: "/images/farmshield-project-photo.jpg",
  },
  {
    title: "MataGunung",
    year: 2024,
    category: "ai",
    catLabel: "COMPUTER VISION",
    glyph: "MATAGUNUNG",
    description:
      "Vision-based monitoring system for tracking conditions across remote terrain, using a Python and OpenCV pipeline with a YOLO detection model to interpret camera feeds in real time.",
    tags: ["YOLO", "OpenCV", "Python"],
    links: [{ label: "↗ GitHub", href: "https://github.com/FikriBinaul/MataGunungApp" }],
    img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "CHOP-X",
    year: 2024,
    category: "automation",
    catLabel: "AUTOMATION",
    glyph: "CHOP-X",
    description:
      "Arduino-based embedded automation unit with a closed-loop control system, built to take a repetitive manual processing task and run it unattended.",
    tags: ["Arduino", "Automation", "Control Systems"],
    links: [{ label: "↗ Demo", href: "https://ipb.link/chopx" }],
    img: "/images/chop-x-project-photo.jpg",
  },
  {
    title: "SENTRY",
    year: 2025,
    category: "security",
    catLabel: "SECURITY",
    glyph: "SENTRY",
    description:
      "An automatic door system that uses computer vision to recognize authorized individuals and grant access without physical contact. When it detects a registered face or approved credential, an ESP32-controlled actuator unlocks the door in real time — unrecognized attempts are flagged and logged.",
    tags: ["OpenCV", "Python", "ESP32"],
    links: [{ label: "↗ Demo", href: "https://ipb.link/sentry" }],
    img: "/images/sentry-project-photo.jpg",
  },
  {
    title: "Smart Door Lock",
    year: 2025,
    category: "security",
    catLabel: "ACCESS CONTROL",
    glyph: "DOOR/LOCK",
    description:
      "Keyless entry system with authenticated access logs and remote control, built for the UT Digital Hackathon 2025.",
    tags: ["ESP32", "RFID", "Firebase"],
    links: [
      { label: "↗ GitHub", href: "https://github.com/MrafialexanderP/Dashboard_AdminUT" },
      { label: "↗ Hackathon Certificate", href: "#certificates", internal: true },
    ],
    img: "/images/door-lock-project-photo.jpg",
  },
  {
    title: "SIRO — Smart Irrigation",
    year: 2025,
    category: "iot",
    catLabel: "AGRICULTURE IOT",
    glyph: "SIRO",
    description:
      "Automated irrigation scheduling system driven by live soil-moisture and weather data, running on ESP32 sensor nodes with a MySQL-backed dashboard for tracking watering history.",
    tags: ["ESP32", "IoT", "MySQL"],
    links: [{ label: "↗ Demo", href: "https://ipb.link/siro" }],
    img: "/images/siro-project-photo.jpg",
  },
];

export const PROJECT_FILTERS: { value: "all" | ProjectCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "iot", label: "IoT & Sensors" },
  { value: "ai", label: "AI & Vision" },
  { value: "security", label: "Security & Access" },
  { value: "automation", label: "Automation" },
];

export const STACK_GROUPS: { heading: string; items: { abbr: string; label: string; color: string }[] }[] = [
  {
    heading: "On the device",
    items: [
      { abbr: "ESP", label: "ESP32", color: "c1" },
      { abbr: "AR", label: "Arduino", color: "c2" },
      { abbr: "PY", label: "Python", color: "c3" },
      { abbr: "GIT", label: "Git", color: "c4" },
      { abbr: "SQL", label: "MySQL", color: "c5" },
    ],
  },
  {
    heading: "Everything around it",
    items: [
      { abbr: "LV", label: "Laravel", color: "c6" },
      { abbr: "FB", label: "Firebase", color: "c2" },
      { abbr: "YO", label: "YOLO", color: "c1" },
      { abbr: "CV", label: "OpenCV", color: "c4" },
      { abbr: "RX", label: "React", color: "c3" },
      { abbr: "NX", label: "Next.js", color: "c5" },
    ],
  },
];

export const CAPABILITIES: { icon: string; title: string; desc: string; color: string }[] = [
  {
    icon: "HW",
    title: "Embedded Systems Design",
    desc: "Firmware development and hardware integration on ESP32/Arduino platforms, including sensor interfacing, power management, and real-time control loops.",
    color: "linear-gradient(150deg,#7C6CFF,#4d3ffb)",
  },
  {
    icon: "IoT",
    title: "IoT Architecture",
    desc: "Designing distributed, multi-node IoT systems with reliable communication protocols, cloud/local data pipelines, and adaptive scheduling.",
    color: "linear-gradient(150deg,#64D2FF,#2a95d1)",
  },
  {
    icon: "AI",
    title: "Computer Vision & AI",
    desc: "Building real-time detection and classification pipelines with OpenCV and machine learning models such as Random Forest for practical, on-device decision-making.",
    color: "linear-gradient(150deg,#32D74B,#1a9c34)",
  },
  {
    icon: "SEC",
    title: "Network & Access Systems",
    desc: "Implementing secure network configurations and automated access-control systems that combine sensing, authentication, and physical actuation.",
    color: "linear-gradient(150deg,#FF6B4A,#e04b2c)",
  },
  {
    icon: "SW",
    title: "Full-Stack Development",
    desc: "Connecting embedded hardware to usable software — from data dashboards to control interfaces — so systems are actually operable end to end.",
    color: "linear-gradient(150deg,#FFD426,#e0a800)",
  },
  {
    icon: "DOC",
    title: "Research & Technical Writing",
    desc: "Translating experimental work into structured research outputs, from internal reports to national research internship documentation.",
    color: "linear-gradient(150deg,#a78bfa,#6d4fe0)",
  },
];

export const CERTIFICATES: Certificate[] = [
  {
    cat: "INTELLECTUAL PROPERTY — HAKI",
    title: "Surat Pencatatan Ciptaan (Copyright) — Water Quality Monitoring System",
    issuer: "Kementerian Hukum RI, for Institut Pertanian Bogor · Co-inventor, Swarm Aerator research",
    date: "Registered 1 May 2026 · No. 001262449",
    img: "/images/haki-surat-pencatatan-ciptaan-certificat.jpg",
  },
  {
    cat: "RESEARCH TRAINING",
    title: "Pelatihan Pembekalan Magang BRIN",
    issuer: "Badan Riset dan Inovasi Nasional (BRIN) · 25 training hours",
    date: "16 Feb 2026",
    img: "/images/brin-internship-briefing-training-certif.jpg",
  },
  {
    cat: "CYBERSECURITY",
    title: "CyberOps Associate",
    issuer: "Cisco Networking Academy, via Sekolah Vokasi IPB University",
    date: "05 Jul 2026",
    img: "/images/cyberops-associate-certificate.jpg",
  },
  {
    cat: "NETWORKING",
    title: "CCNA: Enterprise Networking, Security, and Automation",
    issuer: "Cisco Networking Academy, via Sekolah Vokasi IPB University",
    date: "04 Jun 2026",
    img: "/images/ccna-enterprise-networking-security-and-.jpg",
  },
  {
    cat: "PROFESSIONAL COMPETENCY",
    title: "Sertifikat Kompetensi — Junior Network Administrator",
    issuer: "Badan Nasional Sertifikasi Profesi (BNSP) · Rekayasa Jaringan Komputer",
    date: "02 May 2023 · valid 3 years",
    img: "/images/bnsp-junior-network-administrator-compet.jpg",
  },
  {
    cat: "HACKATHON",
    title: "UT Digital Hackathon 2025 — Certificate of Appreciation",
    issuer: "PT United Tractors Tbk · Participant, Team behind the Smart Door Lock dashboard",
    date: "16 Oct 2025 · Jakarta",
    img: "/images/ut-digital-hackathon-2025-certificate-of.jpg",
  },
  {
    cat: "COMPETITION AWARD",
    title: "2nd Place, Infographic Competition — Team ThreeCom",
    issuer: "Prodi Teknik Kimia, Universitas Singaperbangsa Karawang (Unsika)",
    date: "14 Aug 2025",
    img: "/images/juara-2-lomba-infographic-certificate.jpg",
  },
  {
    cat: "NETWORKING",
    title: "Network Security",
    issuer: "Cisco Networking Academy, via Sekolah Vokasi IPB University",
    date: "26 Dec 2025",
    img: "/images/network-security-certificate.jpg",
  },
  {
    cat: "NETWORKING",
    title: "CCNAv7: Introduction to Networks",
    issuer: "Cisco Networking Academy, via Sekolah Vokasi IPB University",
    date: "15 Dec 2023",
    img: "/images/ccnav7-introduction-to-networks-certific.jpg",
  },
  {
    cat: "PROFESSIONAL COMPETENCY",
    title: "Troubleshooting Keamanan Jaringan pada Jaringan WAN — Sangat Kompeten",
    issuer: "Idenitive Mashable Prototyping, via SMK Nasional",
    date: "03 May 2023 · Depok",
    img: "/images/idenitive-competency-assessment-certific.jpg",
  },
  {
    cat: "RESEARCH TRAINING",
    title: "Self-Directed Learning — Sampling Techniques",
    issuer: "BRIN, via LMS BRILIANT · 12 training hours",
    date: "16 Feb 2026 · Jakarta",
    img: "/images/sertifikat-pelatihan-teknik-pengambilan-sampel.jpg",
  },
  {
    cat: "RESEARCH TRAINING",
    title: "Self-Directed Learning — Scientific Reference Searching",
    issuer: "BRIN, via LMS BRILIANT · 12 training hours",
    date: "16 Feb 2026 · Jakarta",
    img: "/images/sertifikat-pelatihan-penelusuran-referensi-ilmiah.jpg",
  },
  {
    cat: "RESEARCH TRAINING",
    title: "Self-Directed Learning — Creating a Compelling Scientific Poster",
    issuer: "BRIN, via LMS BRILIANT · 15 training hours",
    date: "16 Feb 2026 · Jakarta",
    img: "/images/sertifikat-pelatihan-poster-ilmiah.jpg",
  },
  {
    cat: "RESEARCH TRAINING",
    title: "Self-Directed Learning — Mastering the 3-Minute Scientific Presentation Technique",
    issuer: "BRIN, via LMS BRILIANT · 12 training hours",
    date: "16 Feb 2026 · Jakarta",
    img: "/images/sertifikat-pelatihan-presentasi-ilmiah-3-menit.jpg",
  },
  {
    cat: "RESEARCH TRAINING",
    title: "Self-Directed Learning — Body Language in Presentation Technique",
    issuer: "BRIN, via LMS BRILIANT · 15 training hours",
    date: "16 Feb 2026 · Jakarta",
    img: "/images/sertifikat-pelatihan-bahasa-tubuh.jpg",
  },
];

export interface SpotlightDestination {
  title: string;
  sub: string;
  icon: string;
  color: string;
  goto: string | null;
}

export const SPOTLIGHT_DESTINATIONS: SpotlightDestination[] = [
  { title: "Home", sub: "Back to the top", icon: "⌂", color: "#7C6CFF", goto: "hero" },
  { title: "About", sub: "Who Am I", icon: "☺", color: "#64D2FF", goto: "who-am-i" },
  { title: "Experience", sub: "Roles & the BRIN internship", icon: "📅", color: "#32D74B", goto: "journey" },
  { title: "Projects", sub: "Eight engineering builds", icon: "⚙", color: "#FF6B4A", goto: "projects" },
  { title: "Swarm Aerator", sub: "Project — IoT / Research", icon: "⚙", color: "#FF6B4A", goto: "projects" },
  { title: "Smart Plantar Pressure Monitoring", sub: "Project — Healthcare AI, BRIN", icon: "⚙", color: "#FF6B4A", goto: "projects" },
  { title: "SENTRY", sub: "Project — Vision-based access control", icon: "⚙", color: "#FF6B4A", goto: "projects" },
  { title: "Smart Door Lock", sub: "Project — Access control, Hackathon 2025", icon: "⚙", color: "#FF6B4A", goto: "projects" },
  { title: "SIRO — Smart Irrigation", sub: "Project — Agriculture IoT", icon: "⚙", color: "#FF6B4A", goto: "projects" },
  { title: "Stack", sub: "Tools I build with", icon: "▦", color: "#FFD426", goto: "stack" },
  { title: "Capabilities", sub: "What I can deliver", icon: "⚑", color: "#a78bfa", goto: "capabilities" },
  { title: "Hardware Lab", sub: "Robotics, boards & bench imagery", icon: "🛠", color: "#FF9F0A", goto: "lab" },
  { title: "Certificates", sub: "15 credentials & awards", icon: "◧", color: "#7C6CFF", goto: "certificates" },
  { title: "Beyond the Lab", sub: "NASAPALA leadership", icon: "🏔", color: "#64D2FF", goto: "leadership" },
  { title: "Contact", sub: "Email, LinkedIn, GitHub", icon: "✉", color: "#32D74B", goto: "contact" },
  { title: "coffee", sub: "☕ Fueling every 2am firmware bug fix.", icon: "☕", color: "#e0a800", goto: null },
  { title: "sudo make me a sandwich", sub: "Permission denied — try asking nicely.", icon: "⌘", color: "#FF6B4A", goto: null },
  { title: "Terminal", sub: "Run commands on Portfolio OS", icon: "⌘", color: "#5E5CE6", goto: "terminal" },
  { title: "Calculator", sub: "Do the math", icon: "=", color: "#FF9F0A", goto: "calculator" },
  { title: "Snake", sub: "Lab arcade minigame", icon: "◈", color: "#30D158", goto: "snake" },
  { title: "Notes", sub: "Everything about Fikri, editable", icon: "🗒", color: "#FFD426", goto: "notes" },
  { title: "Assistant", sub: "AI that answers from his profile", icon: "✦", color: "#a78bfa", goto: "assistant" },
  { title: "Resume", sub: "Generate & save a PDF resume", icon: "▤", color: "#2dd4bf", goto: "resume" },
];

export const DOCK_ITEMS: { id: string; icon: string; label: string; c1: string; c2: string }[] = [
  { id: "hero", icon: "⌂", label: "Home", c1: "#7C6CFF", c2: "#4d3ffb" },
  { id: "who-am-i", icon: "☺", label: "About", c1: "#64D2FF", c2: "#2a95d1" },
  { id: "journey", icon: "📅", label: "Experience", c1: "#32D74B", c2: "#1a9c34" },
  { id: "projects", icon: "⚙", label: "Projects", c1: "#FF6B4A", c2: "#e04b2c" },
  { id: "stack", icon: "▦", label: "Stack", c1: "#FFD426", c2: "#e0a800" },
  { id: "capabilities", icon: "⚑", label: "Capabilities", c1: "#a78bfa", c2: "#6d4fe0" },
  { id: "lab", icon: "🛠", label: "Hardware Lab", c1: "#FF9F0A", c2: "#c46a00" },
  { id: "certificates", icon: "◧", label: "Certificates", c1: "#7C6CFF", c2: "#4d3ffb" },
  { id: "leadership", icon: "🏔", label: "Beyond the Lab", c1: "#64D2FF", c2: "#2a95d1" },
  { id: "contact", icon: "✉", label: "Contact", c1: "#32D74B", c2: "#1a9c34" },
  { id: "terminal", icon: "⌘", label: "Terminal", c1: "#5E5CE6", c2: "#3634a3" },
  { id: "calculator", icon: "=", label: "Calculator", c1: "#FF9F0A", c2: "#c46a00" },
  { id: "snake", icon: "◈", label: "Snake", c1: "#30D158", c2: "#1f8f3d" },
  { id: "notes", icon: "🗒", label: "Notes", c1: "#FFD426", c2: "#d9a400" },
  { id: "assistant", icon: "✦", label: "Assistant", c1: "#a78bfa", c2: "#6d4fe0" },
  { id: "resume", icon: "▤", label: "Resume", c1: "#2dd4bf", c2: "#0f766e" },
];

export const PHOTOS: { img: string; alt: string; caption: string; note: string }[] = [
  {
    img: "/images/serving-as-event-chairperson.jpg",
    alt: "Serving as event chairperson",
    caption: "Event Chairperson",
    note: "Led the department's flagship event end to end — from rundown to the stage.",
  },
  {
    img: "/images/serving-as-field-coordinator-for-the-stu.jpg",
    alt: "Serving as field coordinator for the study program at VISCO",
    caption: "Field Coordinator, Department — VISCO",
    note: "Coordinated the study program's field activities on-site at VISCO.",
  },
  {
    img: "/images/presenting-swarm-aerator-research-result.jpg",
    alt: "Presenting Swarm Aerator research results with lecturer",
    caption: "Presenting Research Results — Swarm Aerator",
    note: "Presented the Swarm Aerator research together with the supervising lecturer.",
  },
];

/** Remote assets (Unsplash) used as ambient backdrops. */
export const REMOTE_ASSETS = {
  wallpaper:
    "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop",
  heroOrb:
    "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1400&auto=format&fit=crop",
};