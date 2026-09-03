"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { DOCK_ITEMS } from "@/lib/data";

/** Dock icon ids → app registry ids. */
const APP_MAP: Record<string, string> = {
  hero: "profile",
  "who-am-i": "about",
  journey: "experience",
};

interface DockProps {
  onLaunch: (id: string) => void;
  running: string[];
  focused: string | null;
  bounceId: string | null;
  ready: boolean;
  /** Apps available in the current Time Machine era. */
  allowed?: Set<string>;
}

function DockItem({
  icon,
  label,
  c1,
  c2,
  mouseX,
  running,
  active,
  bounce,
  onClick,
}: {
  icon: string;
  label: string;
  c1: string;
  c2: string;
  mouseX: MotionValue<number>;
  running: boolean;
  active: boolean;
  bounce: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const iconCtl = useAnimationControls();
  const bounceSeen = useRef(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const widthSync = useTransform(distance, [-110, 0, 110], [44, 68, 44]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 250, damping: 16 });
  const lift = useTransform(distance, [-110, 0, 110], [0, -12, 0]);

  useEffect(() => {
    if (bounce && !bounceSeen.current) {
      bounceSeen.current = true;
      iconCtl.start({
        y: [0, -18, 0, -9, 0],
        transition: { duration: 0.7, times: [0, 0.38, 0.56, 0.82, 1], ease: "easeOut" },
      });
    } else if (!bounce) {
      bounceSeen.current = false;
    }
  }, [bounce, iconCtl]);

  return (
    <motion.button
      ref={ref}
      className={`dock-item ${running ? "running" : ""} ${active ? "active" : ""}`}
      style={
        {
          width,
          height: width,
          y: lift,
          "--dc1": c1,
          "--dc2": c2,
        } as never
      }
      data-label={label}
      onClick={onClick}
      aria-label={`${label}${running ? " (running)" : ""}`}
      whileTap={{ scale: 0.9 }}
    >
      <motion.span className="dock-icon" animate={iconCtl}>
        {icon}
      </motion.span>
      <span className="indicator" />
    </motion.button>
  );
}

/** macOS dock with cursor-proximity magnification — launches app windows. */
export default function Dock({
  onLaunch,
  running,
  focused,
  bounceId,
  ready,
  allowed,
}: DockProps) {
  const mouseX = useMotionValue(-1000);
  const springX = useSpring(mouseX, { stiffness: 250, damping: 24 });
  const visible = allowed
    ? DOCK_ITEMS.filter((item) => allowed.has(APP_MAP[item.id] ?? item.id))
    : DOCK_ITEMS;

  return (
    <div className="dock-wrap">
      <motion.nav
        className="dock"
        aria-label="Dock"
        initial={false}
        animate={ready ? { y: 0, opacity: 1 } : { y: 110, opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 17, delay: ready ? 0.25 : 0 }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(-1000)}
      >
        {visible.map((item) => {
          const appId = APP_MAP[item.id] ?? item.id;
          return (
            <DockItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              c1={item.c1}
              c2={item.c2}
              mouseX={springX}
              running={running.includes(appId)}
              active={focused === appId}
              bounce={bounceId === appId}
              onClick={() => onLaunch(appId)}
            />
          );
        })}
      </motion.nav>
    </div>
  );
}