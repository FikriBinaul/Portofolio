"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PHOTOS } from "@/lib/data";

/** 07 — Beyond the Lab / Photos.app */
export default function Leadership() {
  return (
    <>
          <div className="section-eyebrow">
            <span className="idx">08</span> Beyond the Lab
          </div>
          <h2 className="section-title">Leading in the field, not just the workbench.</h2>
          <p className="section-sub">
            Expeditions, field coordination, and presenting research results — the parts of the job
            that happen away from a screen.
          </p>

          <div className="leadership-card">
            <motion.div
              className="leadership-visual"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              NASAPALA
            </motion.div>
            <div className="leadership-body">
              <div className="leadership-role">President</div>
              <div className="leadership-org">NASAPALA — 2021 – 2023</div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Led the organization through two years of expeditions and operations — setting
                objectives, delegating across teams, and staying accountable for outcomes in the
                field.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Coordinated logistics for multi-day expeditions: routes, equipment, safety protocol,
                and contingency planning where a missed detail has real consequences.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Built the communication discipline that made a volunteer team function like a unit —
                clear briefings, fast decisions, and a culture where every member knew the plan.
              </motion.p>
            </div>
          </div>

          <div className="photos-strip">
            {PHOTOS.map((photo, i) => (
              <motion.figure
                key={photo.caption}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ type: "spring", stiffness: 120, damping: 18, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Image
                  src={photo.img}
                  alt={photo.alt}
                  width={400}
                  height={300}
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <figcaption>
                  <span className="ph-cap">{photo.caption}</span>
                  <span className="ph-note">{photo.note}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
    </>
  );
}