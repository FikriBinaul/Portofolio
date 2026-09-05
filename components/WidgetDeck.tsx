"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";
import WidgetClock from "@/components/WidgetClock";
import WidgetWeather from "@/components/WidgetWeather";
import WidgetSysMon from "@/components/WidgetSysMon";
import WidgetNotes from "@/components/WidgetNotes";
import WidgetCalendar from "@/components/WidgetCalendar";
import WidgetEq from "@/components/WidgetEq";
import WidgetUptime from "@/components/WidgetUptime";
import type { ObjId } from "@/components/ObjectBay3D";

// 3D canvas is browser-only — never server-render it.
const ObjectBay = dynamic(() => import("@/components/ObjectBay3D"), { ssr: false });

const OBJ_IDS: ObjId[] = ["gears", "chip", "duck"];

/** The living desktop: a deck of live widgets + the 3D object bay. */
export default function WidgetDeck() {
  const [obj, setObj] = useState(0);
  const cycle = (dir: number) => setObj((o) => (o + dir + OBJ_IDS.length) % OBJ_IDS.length);

  return (
    <motion.div
      className="widget-deck"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <WidgetClock />
      <WidgetWeather />
      <WidgetSysMon />
      <WidgetNotes />
      <WidgetCalendar />
      <WidgetEq />
      <WidgetUptime />
      <ObjectBay id={OBJ_IDS[obj]} onPrev={() => cycle(-1)} onNext={() => cycle(1)} />
    </motion.div>
  );
}