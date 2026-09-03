"use client";

import { createContext, useContext } from "react";
import type { EraId } from "@/lib/eras";

export interface DesktopApi {
  openApp: (id: string) => void;
  focusApp: (id: string) => void;
  era: EraId;
  setEra: (era: EraId) => void;
}

/** Lets window content (CTAs, internal links) drive the desktop. */
export const DesktopContext = createContext<DesktopApi>({
  openApp: () => {},
  focusApp: () => {},
  era: 2026,
  setEra: () => {},
});

export const useDesktop = () => useContext(DesktopContext);
