"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { PROJECT_FILTERS, PROJECTS, type Project, type ProjectCategory } from "@/lib/data";
import { useDesktop } from "@/components/DesktopContext";
import { eraLabel, eraYear } from "@/lib/eras";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { openApp } = useDesktop();
  return (
    <motion.article
      className="p-card"
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 130, damping: 18, delay: index * 0.04 }}
      whileHover={{ y: -6 }}
    >
      <div className="p-card-top">
        {project.img ? (
          <Image
            src={project.img}
            alt={`${project.title} project photo`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="p-card-img"
          />
        ) : (
          <div className="p-card-fallback" />
        )}
        <span className="p-card-cat">{project.catLabel}</span>
        <span className="p-card-glyph">{project.glyph}</span>
      </div>
      <div className="p-card-body">
        <div className="p-card-title">{project.title}</div>
        <p className="p-card-desc">{project.description}</p>
        <div className="p-card-tags">
          {project.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <div className="p-card-links">
          {project.links.map((link) =>
            link.internal ? (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  openApp(link.href.slice(1));
                }}
              >
                {link.label}
              </a>
            ) : (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            )
          )}
        </div>
      </div>
    </motion.article>
  );
}

/** 03 — Engineering Projects / Workshop.app */
export default function Projects() {
  const { era } = useDesktop();
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");
  const eraList = PROJECTS.filter((p) => (p.year ?? 2026) <= eraYear(era));
  const visible =
    filter === "all" ? eraList : eraList.filter((p) => p.category === filter);

  return (
    <div className="shop-frame">
          <div className="shop-hazard" aria-hidden="true" />
          <span className="shop-rivet t1" aria-hidden="true" />
          <span className="shop-rivet t2" aria-hidden="true" />
          <span className="shop-rivet b1" aria-hidden="true" />
          <span className="shop-rivet b2" aria-hidden="true" />
          <div className="section-eyebrow">
              <span className="idx">03</span> Engineering Projects
            </div>
            <h2 className="section-title">Built, shipped, deployed.</h2>
            <p className="section-sub">
              Eight embedded and full-stack systems spanning agriculture, aquaculture, healthcare,
              security, and access control.
            </p>

            <div className="shop-log">
              <span>[ LINE 03 · ASSEMBLY CELL ]</span>
              <span>
                STATUS: {eraList.length}/8 UNITS · SNAPSHOT {eraLabel(era)}
              </span>
            </div>

            <div className="segctrl" role="group" aria-label="Filter projects by category">
            {PROJECT_FILTERS.map((f) => (
              <motion.button
                key={f.value}
                className={filter === f.value ? "active" : ""}
                onClick={() => setFilter(f.value)}
                whileTap={{ scale: 0.95 }}
                layout
              >
                {f.label}
              </motion.button>
            ))}
          </div>

          <motion.div className="projects-grid" layout>
            <AnimatePresence mode="popLayout">
              {visible.map((project, i) => (
                <ProjectCard key={project.title} project={project} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
          <div className="shop-hazard bottom" aria-hidden="true" />
        </div>
  );
}