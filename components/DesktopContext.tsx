"use client";

import { createContext, useContext } from "react";

export interface DesktopApi {
  openApp: (id: string) => void;
  focusApp: (id: string) => void;
}

/** Lets window content (CTAs, internal links) drive the desktop. */
export const DesktopContext = createContext<DesktopApi>({
  openApp: () => {},
  focusApp: () => {},
});

export const useDesktop = () => useContext(DesktopContext);
