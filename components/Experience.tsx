"use client";

import { motion } from "framer-motion";
import { EXPERIENCE } from "@/lib/data";

/** 02 — Experience / Calendar.app */
export default function Experience() {
  const list = EXPERIENCE;
  return (
    <>
          <div className="section-eyebrow">
            <span className="idx">02</span> Experience
          </div>
          <h2 className="section-title">Roles, teams, and one national research internship.</h2>
          <p className="section-sub">
            Professional roles and collaborations — from technical support to research at a national
            agency.
          </p>

          <div className="cal-list">
            {list.map((item, i) => (
              <motion.div
                key={item.role + item.date}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ type: "spring", stiffness: 120, damping: 18, delay: i * 0.08 }}
              >
                <div className="cal-row">
                  <span className="cal-date">{item.date}</span>
                  <div className="cal-body">
                    <div className="role">{item.role}</div>
                    <div className="org">{item.org}</div>
                  </div>
                </div>
                {i < list.length - 1 && <div className="cal-divider" />}
              </motion.div>
            ))}
          </div>
    </>
  );
}