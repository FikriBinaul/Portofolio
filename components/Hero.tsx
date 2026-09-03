"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ERA_META } from "@/lib/eras";
import { useDesktop } from "@/components/DesktopContext";

const entrance = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 130, damping: 20, delay: 0.12 * i },
  }),
};

/** Hero desktop — animated title, typing role cycler, stats widgets. */
export default function Hero() {
  const { openApp, era } = useDesktop();
  const reduce = useReducedMotion();
  const meta = ERA_META[era];
  const roles = meta.roles;
  const [role, setRole] = useState(roles[0]);
  const [phase, setPhase] = useState<"typing" | "erasing">("typing");
  const [charCount, setCharCount] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);

  // Restart the typewriter when the Time Machine jumps years.
  useEffect(() => {
    setRole(roles[0]);
    setRoleIndex(0);
    setPhase("typing");
    setCharCount(0);
  }, [era]); // eslint-disable-line react-hooks/exhaustive-deps

  // Typing / erasing role cycler
  useEffect(() => {
    if (reduce) {
      setRole(roles[0]);
      return;
    }
    const word = roles[roleIndex];
    if (!word) return;
    let delay: number;
    let next: () => void;
    if (phase === "typing") {
      if (charCount <= word.length) {
        setRole(word.slice(0, charCount));
        delay = 42;
        next = () => setCharCount((c) => c + 1);
      } else {
        delay = 1500;
        next = () => setPhase("erasing");
      }
    } else {
      if (charCount >= 0) {
        setRole(word.slice(0, charCount));
        delay = 26;
        next = () => setCharCount((c) => c - 1);
      } else {
        delay = 250;
        next = () => {
          setRoleIndex((i) => (i + 1) % roles.length);
          setPhase("typing");
          setCharCount(0);
        };
      }
    }
    const t = setTimeout(next, delay);
    return () => clearTimeout(t);
  }, [charCount, phase, roleIndex, reduce, roles]);

  return (
    <div className="profile-hero">
      <motion.div
        className="profile-avatar"
        variants={entrance}
        initial="hidden"
        animate="show"
        custom={0}
      >
        <Image
          src="/images/fikri-binaul-umah.jpg"
          alt="Fikri Binaul Umah"
          width={112}
          height={112}
          priority
        />
        <span className="profile-online" title="Open to opportunities" />
      </motion.div>
      <motion.div className="hero-eyebrow" variants={entrance} initial="hidden" animate="show" custom={0}>
        {era === 2026
          ? "// engineer_profile.init — booted"
          : `// time_machine: snapshot ${meta.chip} — ${meta.label.toUpperCase()}`}
      </motion.div>
      <motion.h1 className="hero-title" variants={entrance} initial="hidden" animate="show" custom={1}>
        <span className="sub">Sensors to systems —</span>
        <span className="name">Fikri Binaul Umah</span>
      </motion.h1>
      <motion.div className="role-cycler" variants={entrance} initial="hidden" animate="show" custom={2}>
        <span id="roleText">{role}</span>
        <span className="role-cursor" />
      </motion.div>
      <motion.p className="hero-lede" variants={entrance} initial="hidden" animate="show" custom={3}>
        {meta.lede}
      </motion.p>
      <motion.div className="profile-facts" variants={entrance} initial="hidden" animate="show" custom={4}>
        {meta.facts.map((f) => (
          <span className="tag" key={f}>
            {f}
          </span>
        ))}
      </motion.div>
      <motion.div className="hero-ctas" variants={entrance} initial="hidden" animate="show" custom={5}>
        <button className="btn btn-fill" onClick={() => openApp("projects")}>
          ↓ View Projects
        </button>
        <button className="btn btn-ghost" onClick={() => openApp("resume")}>
          ▤ Download Résumé
        </button>
      </motion.div>
      <motion.div className="profile-socials" variants={entrance} initial="hidden" animate="show" custom={6}>
        <a href="mailto:contact@fikribinaulumah.com">✉ Email</a>
        <a href="https://www.linkedin.com/in/fikribinaulumah/" target="_blank" rel="noopener noreferrer">
          in LinkedIn
        </a>
        <a href="https://github.com/FikriBinaul" target="_blank" rel="noopener noreferrer">
          ⌥ GitHub
        </a>
      </motion.div>
    </div>
  );
}