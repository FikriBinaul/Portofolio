"use client";

import { motion } from "framer-motion";

/** 08 — Contact / Mail.app */
export default function Contact() {
  return (
    <>
          <div className="mail-card">
            <div className="section-eyebrow" style={{ justifyContent: "center" }}>
              <span className="idx">09</span> Contact
            </div>
            <motion.h2
              className="mail-title"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              Let&apos;s build the future together.
            </motion.h2>
            <motion.p
              className="mail-sub"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Open to research collaborations, embedded/IoT engineering roles, and teams building
              intelligent hardware.
            </motion.p>
            <div className="mail-links">
              <motion.a
                className="btn btn-fill"
                href="mailto:contact@fikribinaulumah.com"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                whileHover={{ y: -2, scale: 1.03 }}
              >
                ✉ Email
              </motion.a>
              <motion.a
                className="btn btn-ghost"
                href="https://www.linkedin.com/in/fikri-binaul-umah"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.22 }}
                whileHover={{ y: -2 }}
              >
                in LinkedIn
              </motion.a>
              <motion.a
                className="btn btn-ghost"
                href="https://github.com/FikriBinaul"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.29 }}
                whileHover={{ y: -2 }}
              >
                ⌥ GitHub
              </motion.a>
            </div>
            <div className="mail-meta">
              <span>
                ☎ <b>+62 858-8308-6119</b>
              </span>
              <span>
                ✉ <b>contact@fikribinaulumah.com</b>
              </span>
              <span>
                ⚲ <b>Bogor, Indonesia</b>
              </span>
            </div>
          </div>
    </>
  );
}