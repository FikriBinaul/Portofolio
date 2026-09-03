"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MenuBar from "@/components/MenuBar";
import Dock from "@/components/Dock";
import Spotlight from "@/components/Spotlight";
import WidgetDeck from "@/components/WidgetDeck";
import Window, { type WinState } from "@/components/Window";
import DesktopIcons from "@/components/DesktopIcons";
import ContextMenu from "@/components/ContextMenu";
import BootSplash from "@/components/BootSplash";
import { DesktopContext } from "@/components/DesktopContext";
import { APPS, APP_BY_ID } from "@/lib/apps";
import { appAllowed, DEFAULT_ERA, eraLabel, ERA_ORDER, type EraId } from "@/lib/eras";

const MENUBAR_H = 46;
const DOCK_H = 96;
const STORAGE_KEY = "fbu-win-layout-v1";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Destination aliases used by menu/dock/spotlight navigation. */
const APP_ALIAS: Record<string, string> = {
  hero: "profile",
  "who-am-i": "about",
  journey: "experience",
};

function loadLayout(): Record<string, { x: number; y: number; w: number; h: number }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, { x: number; y: number; w: number; h: number }>) : {};
  } catch {
    return {};
  }
}

function initWindows(): Record<string, WinState> {
  const saved = loadLayout();
  const init: Record<string, WinState> = {};
  for (const app of APPS) {
    const s = saved[app.id];
    init[app.id] = {
      open: false,
      minimized: false,
      maximized: false,
      x: s?.x ?? 0,
      y: s?.y ?? 0,
      w: s?.w ?? app.w,
      h: s?.h ?? app.h,
      z: 0,
    };
  }
  return init;
}

/** The whole operating system: windows, dock, menu bar, widgets, icons. */
export default function Desktop() {
  const [era, setEra] = useState<EraId>(DEFAULT_ERA);
  const [booted, setBooted] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [ctx, setCtx] = useState<{ x: number; y: number } | null>(null);
  const [toast, setToast] = useState(true);
  const [wins, setWins] = useState<Record<string, WinState>>(initWindows);
  const [bounceId, setBounceId] = useState<string | null>(null);
  const zRef = useRef(10);
  const winsRef = useRef(wins);
  const bounceTimer = useRef<number | null>(null);
  winsRef.current = wins;

  const patch = useCallback((id: string, p: Partial<WinState>) => {
    setWins((ws) => ({ ...ws, [id]: { ...ws[id], ...p } }));
  }, []);

  const focusApp = useCallback((id: string) => {
    if (!APP_BY_ID[id]) return;
    zRef.current += 1;
    setWins((ws) => ({ ...ws, [id]: { ...ws[id], minimized: false, z: zRef.current } }));
  }, []);

  const openApp = useCallback((id: string) => {
    if (!APP_BY_ID[id]) return;
    zRef.current += 1;
    const wasOpen = winsRef.current[id]?.open;
    if (!wasOpen) {
      setBounceId(id);
      if (bounceTimer.current) window.clearTimeout(bounceTimer.current);
      bounceTimer.current = window.setTimeout(() => setBounceId(null), 900);
    }
    setWins((ws) => {
      const cur = ws[id];
      if (cur.open && !cur.minimized) {
        return { ...ws, [id]: { ...cur, z: zRef.current } };
      }
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 768;
      if (mobile) {
        // Phones: open near-fullscreen so content stays usable.
        return {
          ...ws,
          [id]: {
            ...cur,
            open: true,
            minimized: false,
            x: 6,
            y: MENUBAR_H + 6,
            w: vw - 12,
            h: Math.max(260, vh - MENUBAR_H - 92),
            z: zRef.current,
          },
        };
      }
      let { x, y } = cur;
      if (x === 0 && y === 0) {
        const w = Math.min(cur.w, vw - 24);
        const h = Math.min(cur.h, vh - MENUBAR_H - DOCK_H - 80);
        const openCount = Object.values(ws).filter((s) => s.open && !s.minimized).length;
        const off = (openCount % 5) * 34;
        x = clamp(Math.round((vw - w) / 2) + off - 60, 10, Math.max(10, vw - w - 10));
        y = clamp(MENUBAR_H + 52 + off, MENUBAR_H + 10, Math.max(MENUBAR_H + 10, vh - h - DOCK_H - 40));
      }
      return { ...ws, [id]: { ...cur, open: true, minimized: false, x, y, z: zRef.current } };
    });
  }, []);

  const closeApp = useCallback((id: string) => {
    setWins((ws) => ({ ...ws, [id]: { ...ws[id], open: false, minimized: false, maximized: false } }));
  }, []);

  const toggleMin = useCallback((id: string) => {
    setWins((ws) => ({ ...ws, [id]: { ...ws[id], minimized: !ws[id].minimized } }));
  }, []);

  const toggleMax = useCallback((id: string) => {
    setWins((ws) => {
      const c = ws[id];
      if (c.maximized) {
        const p = c.prev ?? { x: c.x, y: c.y, w: c.w, h: c.h };
        return { ...ws, [id]: { ...c, maximized: false, ...p } };
      }
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return {
        ...ws,
        [id]: {
          ...c,
          maximized: true,
          prev: { x: c.x, y: c.y, w: c.w, h: c.h },
          x: 10,
          y: MENUBAR_H + 8,
          w: vw - 20,
          h: vh - MENUBAR_H - DOCK_H - 40,
        },
      };
    });
  }, []);

  const moveWin = useCallback(
    (id: string, x: number, y: number) => patch(id, { x, y }),
    [patch]
  );
  const resizeWin = useCallback((id: string, w: number, h: number) => patch(id, { w, h }), [patch]);

  const resetLayout = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setWins((ws) => {
      const next: Record<string, WinState> = {};
      let i = 0;
      for (const app of APPS) {
        const c = ws[app.id];
        if (c.open && !c.minimized) {
          const w = Math.min(c.w, vw - 24);
          const h = Math.min(c.h, vh - MENUBAR_H - DOCK_H - 80);
          const off = (i % 5) * 34;
          next[app.id] = {
            ...c,
            maximized: false,
            prev: undefined,
            x: clamp(Math.round((vw - w) / 2) + off - 60, 10, Math.max(10, vw - w - 10)),
            y: clamp(MENUBAR_H + 52 + off, MENUBAR_H + 10, Math.max(MENUBAR_H + 10, vh - h - DOCK_H - 40)),
          };
          i += 1;
        } else {
          next[app.id] = { ...c, x: 0, y: 0, maximized: false, prev: undefined };
        }
      }
      return next;
    });
  }, []);

  // Wallpaper / OS accent retint per era snapshot.
  useEffect(() => {
    document.body.classList.remove(...ERA_ORDER.map((e) => `era-${e}`));
    document.body.classList.add(`era-${era}`);
    return () => document.body.classList.remove(`era-${era}`);
  }, [era]);

  // Time-travel closes windows for apps that hadn't shipped yet.
  useEffect(() => {
    setWins((ws) => {
      let changed = false;
      const next: Record<string, WinState> = {};
      for (const [id, s] of Object.entries(ws)) {
        if (s.open && !appAllowed(id, era)) {
          next[id] = { ...s, open: false, minimized: false };
          changed = true;
        } else next[id] = s;
      }
      return changed ? next : ws;
    });
  }, [era]);

  // Cmd/Ctrl+K toggles Spotlight; Escape closes it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSpotlightOpen((o) => !o);
      } else if (e.key === "Escape") {
        setSpotlightOpen(false);
        setCtx(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Boot sequence: splash, then open the System Profile window + welcome toast.
  useEffect(() => {
    const t = setTimeout(() => {
      setBooted(true);
      openApp("profile");
    }, 1600);
    return () => clearTimeout(t);
  }, [openApp]);

  useEffect(() => {
    if (!booted) return;
    const t = setTimeout(() => setToast(false), 9000);
    return () => clearTimeout(t);
  }, [booted]);

  // Persist window geometry.
  useEffect(() => {
    if (!booted) return;
    try {
      const saved: Record<string, { x: number; y: number; w: number; h: number }> = {};
      for (const [id, s] of Object.entries(wins)) {
        saved[id] = { x: s.x, y: s.y, w: s.w, h: s.h };
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      /* private mode — ignore */
    }
  }, [wins, booted]);

  const focusedId = useMemo(() => {
    let best: string | null = null;
    let bestZ = -1;
    for (const [id, s] of Object.entries(wins)) {
      if (s.open && !s.minimized && s.z > bestZ) {
        best = id;
        bestZ = s.z;
      }
    }
    return best;
  }, [wins]);

  const activeTitle = focusedId ? APP_BY_ID[focusedId]?.title ?? "PORTFOLIO_OS" : "PORTFOLIO_OS";
  const running = useMemo(
    () => Object.entries(wins).filter(([, s]) => s.open).map(([id]) => id),
    [wins]
  );

  const dockLaunch = useCallback(
    (id: string) => {
      const s = wins[id];
      if (!s?.open) openApp(id);
      else if (focusedId === id) toggleMin(id);
      else focusApp(id);
    },
    [wins, focusedId, openApp, toggleMin, focusApp]
  );

  const navigate = useCallback(
    (goto: string) => {
      const id = APP_ALIAS[goto] ?? goto;
      openApp(id);
    },
    [openApp]
  );

  const allowedApps = useMemo(
    () => new Set(APPS.filter((a) => appAllowed(a.id, era)).map((a) => a.id)),
    [era]
  );
  const eraChip = eraLabel(era);

  return (
    <DesktopContext.Provider value={{ openApp, focusApp, era, setEra }}>
      <div
        className="desktop-stage"
        onContextMenu={(e) => {
          e.preventDefault();
          if ((e.target as HTMLElement).closest(".win")) return;
          setCtx({ x: e.clientX, y: e.clientY });
        }}
      >
        <MenuBar
          activeApp={activeTitle}
          eraChip={eraChip}
          onOpenSpotlight={() => setSpotlightOpen(true)}
          onOpenApp={navigate}
        />

        <div className="desktop-widgets" aria-label="Desktop widgets">
          <WidgetDeck />
        </div>

        <DesktopIcons onOpen={openApp} ready={booted} allowed={allowedApps} />

        <AnimatePresence>
          {APPS.map((app) => {
            const s = wins[app.id];
            if (!s.open) return null;
            return (
              <Window
                key={app.id}
                app={app}
                state={s}
                focused={focusedId === app.id}
                onFocus={() => focusApp(app.id)}
                onClose={() => closeApp(app.id)}
                onMinimize={() => toggleMin(app.id)}
                onToggleMax={() => toggleMax(app.id)}
                onMove={(x, y) => moveWin(app.id, x, y)}
                onResize={(w, h) => resizeWin(app.id, w, h)}
              />
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {ctx && (
            <ContextMenu
              x={ctx.x}
              y={ctx.y}
              onClose={() => setCtx(null)}
              onAbout={() => openApp("profile")}
              onCleanup={resetLayout}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast && booted && (
            <motion.div
              className="desk-toast"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <span className="toast-ic">👋</span>
              <div className="toast-body">
                <b>Welcome to PORTFOLIO_OS 3.0</b>
                <br />
                One click on an icon launches an app — try Terminal, Calculator, or the Snake minigame.
              </div>
              <button className="toast-close" onClick={() => setToast(false)} aria-label="Dismiss">
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Dock
          onLaunch={dockLaunch}
          running={running}
          focused={focusedId}
          bounceId={bounceId}
          ready={booted}
          allowed={allowedApps}
        />

        <Spotlight
          open={spotlightOpen}
          onClose={() => setSpotlightOpen(false)}
          onNavigate={navigate}
          allowed={allowedApps}
        />

        <AnimatePresence>{!booted && <BootSplash />}</AnimatePresence>
      </div>
    </DesktopContext.Provider>
  );
}