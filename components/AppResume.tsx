"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  CERTIFICATES,
  EXPERIENCE,
  PROJECTS,
  STATS,
  STACK_GROUPS,
} from "@/lib/data";

type Accent = "indigo" | "coral" | "teal";

const ACCENTS: Record<Accent, { c: string; name: string }> = {
  indigo: { c: "#4F46E5", name: "Indigo" },
  coral: { c: "#E04B2C", name: "Coral" },
  teal: { c: "#0F766E", name: "Teal" },
};

interface Options {
  accent: Accent;
  experience: boolean;
  projects: boolean;
  education: boolean;
  skills: boolean;
  certificates: boolean;
}

const DEFAULT_OPTS: Options = {
  accent: "indigo",
  experience: true,
  projects: true,
  education: true,
  skills: true,
  certificates: true,
};

const CONTACT_LINE =
  "contact@fikribinaulumah.com  ·  +62 858-8308-6119  ·  linkedin.com/in/fikribinaulumah  ·  github.com/FikriBinaul  ·  Bogor, Indonesia";

function ResumeSheet({ opts, print = false }: { opts: Options; print?: boolean }) {
  const accent = ACCENTS[opts.accent].c;
  const style = { "--rs": accent } as never;
  return (
    <div className={`rs-sheet ${print ? "for-print" : ""}`} style={style}>
      <header className="rs-head">
        <div className="rs-name">Fikri Binaul Umah</div>
        <div className="rs-role">Embedded Systems · IoT · AI/CV · Research Engineer</div>
        <div className="rs-contact">{CONTACT_LINE}</div>
      </header>

      <section className="rs-sec">
        <h3 className="rs-h">Profile</h3>
        <p className="rs-p">
          Computer Engineering Technology student at IPB University (GPA 3.62 / 4.00) building
          systems from sensor to decision — ESP32 firmware, Python intelligence (OpenCV, YOLO,
          Random Forest), and full-stack dashboards. Research intern at BRIN (National Research &
          Innovation Agency); {STATS[0].target}+ projects shipped across agriculture, aquaculture,
          healthcare, security, and automation. Open to internships and remote roles.
        </p>
      </section>

      {opts.experience && (
        <section className="rs-sec">
          <h3 className="rs-h">Experience</h3>
          {EXPERIENCE.map((e) => (
            <div className="rs-item" key={e.role + e.date}>
              <div className="rs-item-head">
                <b>{e.role}</b>
                <span className="rs-date">{e.date.replace("— ", "").trim()} {e.date.startsWith("—") ? "– present" : ""}</span>
              </div>
              <div className="rs-org">{e.org}</div>
              {e.org.includes("BRIN") && (
                <p className="rs-p small">
                  Smart Plantar Pressure Monitoring — distributed FSR arrays + ESP32 + Firebase with
                  Center-of-Pressure analysis for gait &amp; rehabilitation.
                </p>
              )}
              {e.role === "Technical Support Engineer" && (
                <p className="rs-p small">Hardware &amp; system troubleshooting, customer-facing technical support.</p>
              )}
            </div>
          ))}
        </section>
      )}

      {opts.projects && (
        <section className="rs-sec">
          <h3 className="rs-h">Selected Projects</h3>
          {PROJECTS.slice(0, 6).map((p) => (
            <div className="rs-item" key={p.title}>
              <div className="rs-item-head">
                <b>{p.title}</b>
                <span className="rs-date">{p.catLabel.split("•")[0].trim()}</span>
              </div>
              <p className="rs-p small">{p.description}</p>
              <div className="rs-tags">{p.tags.slice(0, 5).join(" · ")}</div>
            </div>
          ))}
        </section>
      )}

      {opts.education && (
        <section className="rs-sec">
          <h3 className="rs-h">Education</h3>
          <div className="rs-item">
            <div className="rs-item-head">
              <b>Computer Engineering Technology — Sekolah Vokasi</b>
              <span className="rs-date">IPB University</span>
            </div>
            <p className="rs-p small">GPA 3.62 / 4.00 · Focus on embedded systems, IoT and applied computer vision.</p>
          </div>
        </section>
      )}

      {opts.skills && (
        <section className="rs-sec">
          <h3 className="rs-h">Skills</h3>
          <div className="rs-skills">
            {STACK_GROUPS.map((g) => (
              <div key={g.heading} className="rs-skills-col">
                <div className="rs-skills-head">{g.heading}</div>
                <div className="rs-tags">{g.items.map((i) => i.label).join(" · ")}</div>
              </div>
            ))}
            <div className="rs-skills-col">
              <div className="rs-skills-head">Networking</div>
              <div className="rs-tags">CCNA · CyberOps · Network Security · Linux</div>
            </div>
          </div>
        </section>
      )}

      {opts.certificates && (
        <section className="rs-sec">
          <h3 className="rs-h">Certifications &amp; Awards</h3>
          {CERTIFICATES.slice(0, 5).map((c) => (
            <div className="rs-item" key={c.title}>
              <div className="rs-item-head">
                <b>{c.title}</b>
                <span className="rs-date">{c.date.split("·")[0].trim()}</span>
              </div>
              <div className="rs-org">{c.issuer.split("·")[0].trim()}</div>
            </div>
          ))}
        </section>
      )}

      <footer className="rs-foot">Generated from Portfolio OS · Resume.app — fikribinaulumah.com</footer>
    </div>
  );
}

function Toggle({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`rs-toggle ${on ? "on" : ""}`} onClick={onClick} aria-pressed={on}>
      {label}
    </button>
  );
}

/** Resume.app — live professional resume with print / save-as-PDF. */
export default function AppResume() {
  const [opts, setOpts] = useState<Options>(DEFAULT_OPTS);
  const [printing, setPrinting] = useState(false);
  const [printed, setPrinted] = useState(false);

  const set = (patch: Partial<Options>) => setOpts((o) => ({ ...o, ...patch }));

  const doPrint = () => {
    setPrinting(true);
  };

  useEffect(() => {
    if (!printing) return;
    const t = window.setTimeout(() => {
      window.print();
    }, 200);
    const after = () => {
      setPrinting(false);
      setPrinted(true);
      window.setTimeout(() => setPrinted(false), 2500);
    };
    window.addEventListener("afterprint", after);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("afterprint", after);
    };
  }, [printing]);

  return (
    <div className="app-resume">
      <div className="resume-toolbar">
        <div className="rt-group">
          <span className="rt-label">Accent</span>
          {(Object.keys(ACCENTS) as Accent[]).map((a) => (
            <button
              key={a}
              className={`rt-dot ${opts.accent === a ? "sel" : ""}`}
              style={{ background: ACCENTS[a].c }}
              onClick={() => set({ accent: a })}
              aria-label={`${ACCENTS[a].name} accent`}
              title={ACCENTS[a].name}
            />
          ))}
        </div>
        <div className="rt-group grow">
          <span className="rt-label">Sections</span>
          <Toggle label="Experience" on={opts.experience} onClick={() => set({ experience: !opts.experience })} />
          <Toggle label="Projects" on={opts.projects} onClick={() => set({ projects: !opts.projects })} />
          <Toggle label="Education" on={opts.education} onClick={() => set({ education: !opts.education })} />
          <Toggle label="Skills" on={opts.skills} onClick={() => set({ skills: !opts.skills })} />
          <Toggle label="Certificates" on={opts.certificates} onClick={() => set({ certificates: !opts.certificates })} />
        </div>
        <button className="btn btn-fill rs-print-btn" onClick={doPrint}>
          ⎙ Save as PDF
        </button>
      </div>

      <div className="resume-paper">
        <ResumeSheet opts={opts} />
      </div>

      <div className="resume-hint">Tip: “Save as PDF” opens your print dialog — choose “Save as PDF” as the destination.</div>

      {printed && <div className="resume-toast">✓ Sent to printer / PDF</div>}

      {printing &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="print-sheet">
            <ResumeSheet opts={opts} print />
          </div>,
          document.body
        )}
    </div>
  );
}