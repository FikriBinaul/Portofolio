"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import QuickLook from "@/components/QuickLook";
import { CERTIFICATES, type Certificate } from "@/lib/data";
import { useDesktop } from "@/components/DesktopContext";
import { eraLabel, eraYear } from "@/lib/eras";

const certYear = (date: string) => {
  const m = date.match(/20\d\d/);
  const y = m ? Number(m[0]) : 0;
  return y >= 2000 && y <= 2100 ? y : 9999;
};

/** 06 — Certificates / Finder + Quick Look */
export default function Certificates() {
  const { era } = useDesktop();
  const list = CERTIFICATES.filter((c) => certYear(c.date) <= eraYear(era));
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <>
          <div className="section-eyebrow">
            <span className="idx">07</span> Certificates &amp; Awards
          </div>
          <h2 className="section-title" style={{ marginBottom: 4 }}>
            Credentials behind the code.
          </h2>
          <p className="section-sub">
            Networking, cybersecurity, and research credentials from Cisco Networking Academy, BNSP,
            BRIN, and beyond — plus a registered copyright and a hackathon appreciation. Click any
            file to Quick Look it.
          </p>
          <div className="cert-head-row">
            <span style={{ fontSize: 12, color: "var(--text-faint)" }}>
              {list.length} items · snapshot {eraLabel(era)}
            </span>
            <div className="viewswitch" role="group" aria-label="Switch view">
              <button
                className={view === "grid" ? "active" : ""}
                data-view="grid"
                aria-label="Icon view"
                onClick={() => setView("grid")}
              >
                ⊞
              </button>
              <button
                className={view === "list" ? "active" : ""}
                data-view="list"
                aria-label="List view"
                onClick={() => setView("list")}
              >
                ☰
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {view === "grid" ? (
              <motion.div
                key="grid"
                className="cert-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {list.map((cert, i) => (
                  <motion.div
                    key={cert.title}
                    className="finder-icon"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                    transition={{ delay: (i % 5) * 0.03 }}
                  >
                    <button type="button" onClick={() => setSelected(cert)}>
                      <div className="thumb">
                        <Image
                          src={cert.img}
                          alt={cert.title}
                          width={240}
                          height={180}
                          sizes="(max-width: 640px) 45vw, 160px"
                        />
                      </div>
                      <div className="name">{cert.title}</div>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="cert-list-view active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <div className="cert-list-head">
                  <span />
                  <span>Name</span>
                  <span className="cl-issuer">Issuer</span>
                  <span className="cl-date">Date</span>
                </div>
                {list.map((cert, i) => (
                  <motion.button
                    key={cert.title}
                    type="button"
                    className="cert-list-row"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.015 }}
                    onClick={() => setSelected(cert)}
                  >
                    <span className="mini-thumb">
                      <Image src={cert.img} alt="" width={32} height={32} />
                    </span>
                    <span className="cert-list-name">{cert.title}</span>
                    <span className="cert-list-kind cl-issuer">{cert.issuer}</span>
                    <span className="cert-list-date cl-date">{cert.date}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
      <QuickLook cert={selected} onClose={() => setSelected(null)} />
    </>
  );
}