/* ===========================================================
   FIKRI BINAUL UMAH — PORTFOLIO OS
   Powered by Motion (motion.dev — the engine formerly known
   as Framer Motion) for every spring / reveal / magnify.
   =========================================================== */
import { animate, inView, stagger, spring } from "https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* -----------------------------------------------------------
   CERT DATA — single source of truth for grid + list + Quick Look
   ----------------------------------------------------------- */
const certData = [
  { cat:"INTELLECTUAL PROPERTY — HAKI", title:"Surat Pencatatan Ciptaan (Copyright) — Water Quality Monitoring System", issuer:"Kementerian Hukum RI, for Institut Pertanian Bogor · Co-inventor, Swarm Aerator research", date:"Registered 1 May 2026 · No. 001262449", img:"images/haki-surat-pencatatan-ciptaan-certificat.jpg" },
  { cat:"RESEARCH TRAINING", title:"Pelatihan Pembekalan Magang BRIN", issuer:"Badan Riset dan Inovasi Nasional (BRIN) · 25 training hours", date:"16 Feb 2026", img:"images/brin-internship-briefing-training-certif.jpg" },
  { cat:"CYBERSECURITY", title:"CyberOps Associate", issuer:"Cisco Networking Academy, via Sekolah Vokasi IPB University", date:"05 Jul 2026", img:"images/cyberops-associate-certificate.jpg" },
  { cat:"NETWORKING", title:"CCNA: Enterprise Networking, Security, and Automation", issuer:"Cisco Networking Academy, via Sekolah Vokasi IPB University", date:"04 Jun 2026", img:"images/ccna-enterprise-networking-security-and-.jpg" },
  { cat:"PROFESSIONAL COMPETENCY", title:"Sertifikat Kompetensi — Junior Network Administrator", issuer:"Badan Nasional Sertifikasi Profesi (BNSP) · Rekayasa Jaringan Komputer", date:"02 May 2023 · valid 3 years", img:"images/bnsp-junior-network-administrator-compet.jpg" },
  { cat:"HACKATHON", title:"UT Digital Hackathon 2025 — Certificate of Appreciation", issuer:"PT United Tractors Tbk · Participant, Team behind the Smart Door Lock dashboard", date:"16 Oct 2025 · Jakarta", img:"images/ut-digital-hackathon-2025-certificate-of.jpg" },
  { cat:"COMPETITION AWARD", title:"2nd Place, Infographic Competition — Team ThreeCom", issuer:"Prodi Teknik Kimia, Universitas Singaperbangsa Karawang (Unsika)", date:"14 Aug 2025", img:"images/juara-2-lomba-infographic-certificate.jpg" },
  { cat:"NETWORKING", title:"Network Security", issuer:"Cisco Networking Academy, via Sekolah Vokasi IPB University", date:"26 Dec 2025", img:"images/network-security-certificate.jpg" },
  { cat:"NETWORKING", title:"CCNAv7: Introduction to Networks", issuer:"Cisco Networking Academy, via Sekolah Vokasi IPB University", date:"15 Dec 2023", img:"images/ccnav7-introduction-to-networks-certific.jpg" },
  { cat:"PROFESSIONAL COMPETENCY", title:"Troubleshooting Keamanan Jaringan pada Jaringan WAN — Sangat Kompeten", issuer:"Idenitive Mashable Prototyping, via SMK Nasional", date:"03 May 2023 · Depok", img:"images/idenitive-competency-assessment-certific.jpg" },
  { cat:"RESEARCH TRAINING", title:"Self-Directed Learning — Sampling Techniques", issuer:"BRIN, via LMS BRILIANT · 12 training hours", date:"16 Feb 2026 · Jakarta", img:"images/sertifikat-pelatihan-teknik-pengambilan-sampel.jpg" },
  { cat:"RESEARCH TRAINING", title:"Self-Directed Learning — Scientific Reference Searching", issuer:"BRIN, via LMS BRILIANT · 12 training hours", date:"16 Feb 2026 · Jakarta", img:"images/sertifikat-pelatihan-penelusuran-referensi-ilmiah.jpg" },
  { cat:"RESEARCH TRAINING", title:"Self-Directed Learning — Creating a Compelling Scientific Poster", issuer:"BRIN, via LMS BRILIANT · 15 training hours", date:"16 Feb 2026 · Jakarta", img:"images/sertifikat-pelatihan-poster-ilmiah.jpg" },
  { cat:"RESEARCH TRAINING", title:"Self-Directed Learning — Mastering the 3-Minute Scientific Presentation Technique", issuer:"BRIN, via LMS BRILIANT · 12 training hours", date:"16 Feb 2026 · Jakarta", img:"images/sertifikat-pelatihan-presentasi-ilmiah-3-menit.jpg" },
  { cat:"RESEARCH TRAINING", title:"Self-Directed Learning — Body Language in Presentation Technique", issuer:"BRIN, via LMS BRILIANT · 15 training hours", date:"16 Feb 2026 · Jakarta", img:"images/sertifikat-pelatihan-bahasa-tubuh.jpg" },
];

/* -----------------------------------------------------------
   UTIL
   ----------------------------------------------------------- */
function $(sel, ctx=document){ return ctx.querySelector(sel); }
function $$(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)); }
function goto(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: id === "hero" ? "start" : "start" });
}

/* -----------------------------------------------------------
   MENU BAR — live clock + active-app label
   ----------------------------------------------------------- */
function initMenubar(){
  const clock = $("#menubarClock");
  function tick(){
    const now = new Date();
    clock.textContent = now.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", hour12:true });
  }
  tick(); setInterval(tick, 1000 * 15);

  const appLabel = $("#menubarApp");
  const sections = $$("section[data-app]");
  const menuButtons = $$(".menubar-items button");

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        appLabel.textContent = entry.target.dataset.app || "Fikri.app";
        menuButtons.forEach(b => b.classList.toggle("active", b.dataset.goto === entry.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  sections.forEach(s => io.observe(s));

  $$("[data-goto]").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      if(btn.tagName === "A") return; // anchors already navigate
      goto(btn.dataset.goto);
    });
  });
}

/* -----------------------------------------------------------
   REVEAL — windows & cards animate in with Motion springs
   ----------------------------------------------------------- */
function initReveals(){
  const windows = $$(".mac-window");
  windows.forEach((el, i)=>{
    if(reduceMotion){ el.style.opacity = 1; el.style.transform = "none"; return; }
    inView(el, () => {
      animate(el, { opacity:1, transform:"translateY(0px) scale(1)" }, { type: spring, stiffness:120, damping:18 });
    }, { margin: "0px 0px -10% 0px" });
  });

  const cards = $$(".p-card, .finder-icon, .app-icon, .widget-tile");
  cards.forEach(c => { c.style.opacity = 0; c.style.transform = "translateY(14px)"; });
  inView(".projects-grid, .cert-grid, .launchpad-grid, .widget-grid", (target)=>{
    const items = $$(".p-card, .finder-icon, .app-icon, .widget-tile", target);
    if(reduceMotion){ items.forEach(i=>{ i.style.opacity=1; i.style.transform="none"; }); return; }
    animate(items, { opacity:1, transform:"translateY(0px)" }, { delay: stagger(0.04), duration:0.5, ease:"easeOut" });
  }, { margin: "0px 0px -10% 0px" });
}

/* -----------------------------------------------------------
   COUNTERS
   ----------------------------------------------------------- */
function initCounters(){
  const nums = $$(".widget-tile .num");
  inView(".widget-grid", ()=>{
    nums.forEach(el=>{
      if(el.dataset.started) return;
      el.dataset.started = "1";
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || "";
      if(reduceMotion){ el.textContent = target + suffix; return; }
      animateNumber(el, target, suffix);
    });
  }, { margin:"0px 0px -20% 0px" });
}
function animateNumber(el, target, suffix){
  let start = null;
  const duration = 1100;
  function frame(ts){
    if(!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    el.textContent = Math.round(p * target) + suffix;
    if(p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* -----------------------------------------------------------
   HERO — role cycler typing
   ----------------------------------------------------------- */
function initRoleCycler(){
  const roles = ["Embedded Systems Engineer","IoT Engineer","AI Developer","Research Engineer","Robotics Enthusiast","Problem Solver"];
  const el = $("#roleText");
  if(!el) return;
  if(reduceMotion){ el.textContent = roles[0]; return; }
  let idx = 0;
  function typeRole(){
    const word = roles[idx];
    let ci = 0;
    (function typeChar(){
      el.textContent = word.slice(0, ci);
      if(ci <= word.length){ ci++; setTimeout(typeChar, 42); }
      else setTimeout(eraseRole, 1500);
    })();
  }
  function eraseRole(){
    const word = roles[idx];
    let ci = word.length;
    (function eraseChar(){
      el.textContent = word.slice(0, ci);
      if(ci >= 0){ ci--; setTimeout(eraseChar, 26); }
      else { idx = (idx + 1) % roles.length; setTimeout(typeRole, 250); }
    })();
  }
  typeRole();
}

/* -----------------------------------------------------------
   TERMINAL — typed profile readout
   ----------------------------------------------------------- */
function initTerminal(){
  const body = $("#terminalBody");
  if(!body) return;
  const lines = [
    { t:"$ whoami", cls:"muted" },
    { t:"fikri_binaul_umah" },
    { t:"$ cat role.txt", cls:"muted" },
    { t:"Embedded Systems · IoT · AI/CV · Research", cls:"accent" },
    { t:"$ cat education.txt", cls:"muted" },
    { t:"Computer Engineering Technology — IPB University" },
    { t:"GPA 3.62 / 4.00" },
    { t:"$ cat location.txt", cls:"muted" },
    { t:"Bogor, Indonesia — open to remote", cls:"accent" },
    { t:"$ echo status", cls:"muted" },
    { t:"Building sensors-to-systems, one deploy at a time." },
  ];
  if(reduceMotion){
    body.innerHTML = lines.map(l => `<div class="${l.cls||''}">${l.t}</div>`).join("");
    return;
  }
  let li = 0;
  function typeLine(){
    if(li >= lines.length){ body.insertAdjacentHTML("beforeend", '<span class="terminal-cursor"></span>'); return; }
    const line = lines[li];
    const div = document.createElement("div");
    if(line.cls) div.className = line.cls;
    body.appendChild(div);
    let ci = 0;
    (function typeChar(){
      div.textContent = line.t.slice(0, ci);
      if(ci < line.t.length){ ci++; setTimeout(typeChar, 14); }
      else { li++; setTimeout(typeLine, 160); }
    })();
  }
  inView(body, () => { if(!body.dataset.started){ body.dataset.started = "1"; typeLine(); } }, { margin:"0px 0px -20% 0px" });
}

/* -----------------------------------------------------------
   DOCK — magnification-on-hover + navigation
   ----------------------------------------------------------- */
function initDock(){
  const dock = $("#dock");
  const items = $$(".dock-item", dock);
  items.forEach(btn => btn.addEventListener("click", () => goto(btn.dataset.goto)));

  if(reduceMotion || !dock) return;

  dock.addEventListener("mousemove", (e)=>{
    const rect = dock.getBoundingClientRect();
    const mouseX = e.clientX;
    items.forEach(item=>{
      const r = item.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const dist = Math.abs(mouseX - center);
      const maxDist = 110;
      const proximity = Math.max(0, 1 - dist / maxDist);
      const scale = 1 + proximity * 0.55;
      const lift = proximity * -10;
      animate(item, { transform:`translateY(${lift}px) scale(${scale})` }, { duration:0.25, ease:"easeOut" });
    });
  });
  dock.addEventListener("mouseleave", ()=>{
    items.forEach(item => animate(item, { transform:"translateY(0px) scale(1)" }, { type: spring, stiffness:300, damping:20 }));
  });
}

/* -----------------------------------------------------------
   BACK TO TOP
   ----------------------------------------------------------- */
function initBackToTop(){
  const btn = $("#backToTop");
  window.addEventListener("scroll", ()=>{
    btn.classList.toggle("show", window.scrollY > 900);
  }, { passive:true });
  btn.addEventListener("click", ()=> goto("hero"));
}

/* -----------------------------------------------------------
   PROJECTS — filter (segmented control)
   ----------------------------------------------------------- */
function initProjectFilter(){
  const bar = $("#projectFilter");
  if(!bar) return;
  const buttons = $$("button", bar);
  const cards = $$(".p-card", $("#projectsGrid"));
  buttons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      cards.forEach(card=>{
        const show = filter === "all" || card.dataset.cat === filter;
        card.hidden = !show;
        if(show && !reduceMotion) animate(card, { opacity:[0,1], transform:["translateY(8px)","translateY(0px)"] }, { duration:0.35 });
      });
    });
  });
}

/* -----------------------------------------------------------
   CERTIFICATES — render grid + list, Quick Look modal
   ----------------------------------------------------------- */
function initCertificates(){
  const grid = $("#certGrid");
  const listBody = $("#certListBody");
  if(!grid) return;

  grid.innerHTML = certData.map((c, i) => `
    <div class="finder-icon">
      <button type="button" data-idx="${i}">
        <div class="thumb"><img src="${c.img}" alt="${c.title}" loading="lazy"></div>
        <div class="name">${c.title}</div>
      </button>
    </div>`).join("");

  listBody.innerHTML = certData.map((c, i) => `
    <button type="button" class="cert-list-row" data-idx="${i}">
      <span class="mini-thumb"><img src="${c.img}" alt="${c.title}" loading="lazy"></span>
      <span class="cert-list-name">${c.title}</span>
      <span class="cert-list-kind cl-issuer">${c.issuer}</span>
      <span class="cert-list-date cl-date">${c.date}</span>
    </button>`).join("");

  $$("[data-idx]", grid).concat($$("[data-idx]", listBody)).forEach(btn=>{
    btn.addEventListener("click", ()=> openQuickLook(certData[parseInt(btn.dataset.idx,10)]));
  });

  // view switch
  const viewBtns = $$(".viewswitch button");
  const listView = $("#certListView");
  viewBtns.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      viewBtns.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const isGrid = btn.dataset.view === "grid";
      grid.hidden = !isGrid;
      listView.classList.toggle("active", !isGrid);
    });
  });
}

function openQuickLook(cert){
  const backdrop = $("#quicklookBackdrop");
  const panel = $("#quicklookPanel");
  $("#quicklookImg").src = cert.img;
  $("#quicklookImg").alt = cert.title;
  $("#quicklookCat").textContent = cert.cat;
  $("#quicklookName").textContent = cert.title;
  $("#quicklookIssuer").textContent = cert.issuer;
  $("#quicklookDate").textContent = cert.date;
  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
  if(!reduceMotion){
    animate(panel, { transform:["scale(0.92)","scale(1)"], opacity:[0,1] }, { type: spring, stiffness:260, damping:22 });
  } else { panel.style.opacity = 1; panel.style.transform = "scale(1)"; }
}
function closeQuickLook(){
  const backdrop = $("#quicklookBackdrop");
  const panel = $("#quicklookPanel");
  document.body.style.overflow = "";
  if(!reduceMotion){
    animate(panel, { transform:"scale(0.94)", opacity:0 }, { duration:0.2 }).finished.then(()=> backdrop.classList.remove("open"));
  } else backdrop.classList.remove("open");
}
function initQuickLookClose(){
  $("#quicklookClose").addEventListener("click", closeQuickLook);
  $("#quicklookBackdrop").addEventListener("click", (e)=>{ if(e.target.id === "quicklookBackdrop") closeQuickLook(); });
  document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") closeQuickLook(); });
}

/* -----------------------------------------------------------
   SPOTLIGHT — Cmd+K search across the whole site
   ----------------------------------------------------------- */
function initSpotlight(){
  const backdrop = $("#spotlightBackdrop");
  const panel = $("#spotlightPanel");
  const input = $("#spotlightInput");
  const results = $("#spotlightResults");

  const destinations = [
    { title:"Home", sub:"Back to the top", icon:"⌂", color:"#7C6CFF", goto:"hero" },
    { title:"About", sub:"Who Am I", icon:"☺", color:"#64D2FF", goto:"who-am-i" },
    { title:"Experience", sub:"Roles & the BRIN internship", icon:"📅", color:"#32D74B", goto:"journey" },
    { title:"Projects", sub:"Eight engineering builds", icon:"⚙", color:"#FF6B4A", goto:"projects" },
    { title:"Swarm Aerator", sub:"Project — IoT / Research", icon:"⚙", color:"#FF6B4A", goto:"projects" },
    { title:"Smart Plantar Pressure Monitoring", sub:"Project — Healthcare AI, BRIN", icon:"⚙", color:"#FF6B4A", goto:"projects" },
    { title:"SENTRY", sub:"Project — Vision-based access control", icon:"⚙", color:"#FF6B4A", goto:"projects" },
    { title:"Smart Door Lock", sub:"Project — Access control, Hackathon 2025", icon:"⚙", color:"#FF6B4A", goto:"projects" },
    { title:"SIRO — Smart Irrigation", sub:"Project — Agriculture IoT", icon:"⚙", color:"#FF6B4A", goto:"projects" },
    { title:"Stack", sub:"Tools I build with", icon:"▦", color:"#FFD426", goto:"stack" },
    { title:"Capabilities", sub:"What I can deliver", icon:"⚑", color:"#a78bfa", goto:"capabilities" },
    { title:"Certificates", sub:"15 credentials & awards", icon:"◧", color:"#7C6CFF", goto:"certificates" },
    { title:"Beyond the Lab", sub:"NASAPALA leadership", icon:"🏔", color:"#64D2FF", goto:"leadership" },
    { title:"Contact", sub:"Email, LinkedIn, GitHub", icon:"✉", color:"#32D74B", goto:"contact" },
    { title:"coffee", sub:"☕ Fueling every 2am firmware bug fix.", icon:"☕", color:"#e0a800", goto:null },
    { title:"sudo make me a sandwich", sub:"Permission denied — try asking nicely.", icon:"⌘", color:"#FF6B4A", goto:null },
  ];

  let activeIndex = 0;
  let filtered = destinations;

  function render(){
    if(filtered.length === 0){
      results.innerHTML = `<div class="spotlight-empty">No results. Try “projects” or “contact”.</div>`;
      return;
    }
    results.innerHTML = filtered.map((d, i) => `
      <button type="button" class="spotlight-item ${i === activeIndex ? "active" : ""}" data-i="${i}">
        <span class="si-icon" style="background:${d.color}">${d.icon}</span>
        <span class="si-meta"><span class="si-title">${d.title}</span><br><span class="si-sub">${d.sub}</span></span>
      </button>`).join("");
    $$(".spotlight-item", results).forEach(btn=>{
      btn.addEventListener("click", ()=> select(parseInt(btn.dataset.i,10)));
      btn.addEventListener("mouseenter", ()=>{ activeIndex = parseInt(btn.dataset.i,10); render(); });
    });
  }

  function select(i){
    const item = filtered[i];
    if(!item) return;
    if(item.goto) goto(item.goto);
    close();
  }

  function filterList(q){
    const query = q.trim().toLowerCase();
    filtered = query === "" ? destinations : destinations.filter(d =>
      d.title.toLowerCase().includes(query) || d.sub.toLowerCase().includes(query)
    );
    activeIndex = 0;
    render();
  }

  function open(){
    backdrop.classList.add("open");
    input.value = "";
    filterList("");
    document.body.style.overflow = "hidden";
    setTimeout(()=> input.focus(), 60);
    if(!reduceMotion){
      animate(panel, { transform:["scale(0.94) translateY(-6px)","scale(1) translateY(0px)"], opacity:[0,1] }, { type: spring, stiffness:280, damping:24 });
    } else { panel.style.opacity = 1; panel.style.transform = "none"; }
  }
  function close(){
    document.body.style.overflow = "";
    if(!reduceMotion){
      animate(panel, { transform:"scale(0.96)", opacity:0 }, { duration:0.16 }).finished.then(()=> backdrop.classList.remove("open"));
    } else backdrop.classList.remove("open");
  }

  $("#spotlightTrigger").addEventListener("click", open);
  $("#quicklookBackdrop"); // noop guard
  backdrop.addEventListener("click", (e)=>{ if(e.target === backdrop) close(); });
  input.addEventListener("input", ()=> filterList(input.value));
  input.addEventListener("keydown", (e)=>{
    if(e.key === "ArrowDown"){ e.preventDefault(); activeIndex = Math.min(activeIndex+1, filtered.length-1); render(); }
    else if(e.key === "ArrowUp"){ e.preventDefault(); activeIndex = Math.max(activeIndex-1, 0); render(); }
    else if(e.key === "Enter"){ e.preventDefault(); select(activeIndex); }
    else if(e.key === "Escape"){ close(); }
  });
  document.addEventListener("keydown", (e)=>{
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"){ e.preventDefault(); backdrop.classList.contains("open") ? close() : open(); }
  });
}

/* -----------------------------------------------------------
   HERO entrance
   ----------------------------------------------------------- */
function initHeroEntrance(){
  if(reduceMotion) return;
  const els = [".hero-eyebrow", ".hero-title", ".role-cycler", ".hero-lede", ".hero-ctas", ".widget-row"];
  els.forEach((sel, i)=>{
    const el = $(sel);
    if(!el) return;
    el.style.opacity = 0;
    el.style.transform = "translateY(16px)";
    animate(el, { opacity:1, transform:"translateY(0px)" }, { type: spring, stiffness:130, damping:20, delay: 0.12 * i });
  });
}

/* -----------------------------------------------------------
   INIT
   ----------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", ()=>{
  initMenubar();
  initHeroEntrance();
  initRoleCycler();
  initTerminal();
  initReveals();
  initCounters();
  initDock();
  initBackToTop();
  initProjectFilter();
  initCertificates();
  initQuickLookClose();
  initSpotlight();
});
