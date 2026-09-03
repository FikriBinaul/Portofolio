"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { Certificate } from "@/lib/data";

interface QuickLookProps {
  cert: Certificate | null;
  onClose: () => void;
}

/** Quick Look — full-screen certificate preview modal. */
export default function QuickLook({ cert, onClose }: QuickLookProps) {
  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          className="quicklook-backdrop open"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="quicklook"
            role="dialog"
            aria-modal="true"
            aria-label="Quick Look"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="quicklook-bar">
              <div className="traffic">
                <span className="tdot r" />
                <span className="tdot y" />
                <span className="tdot g" />
              </div>
              <span className="ql-title">Quick Look</span>
              <button className="quicklook-close" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="quicklook-img-wrap">
              <Image
                src={cert.img}
                alt={cert.title}
                width={800}
                height={600}
                sizes="(max-width: 640px) 92vw, 640px"
                className="quicklook-img"
              />
            </div>
            <div className="quicklook-info">
              <div className="quicklook-cat">{cert.cat}</div>
              <div className="quicklook-name">{cert.title}</div>
              <div className="quicklook-issuer">{cert.issuer}</div>
              <div className="quicklook-date">{cert.date}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}