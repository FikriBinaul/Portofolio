# Portofolio — Run Doc (Fikri Binaul Umah / Portfolio OS)

Next.js 15 (App Router) + TypeScript + Framer Motion portfolio. No `.env*` files or secrets are
required — the only external dependency is the Unsplash CDN at runtime (wallpaper + Hardware Lab
images), fetched over HTTPS by `next/image`.

## How to reproduce the artifacts a fresh checkout needs

1. Install dependencies with the project's package manager (npm):

   ```bash
   npm install
   ```

2. No env files, generated configs, or other artifacts are needed. The two pieces of content that
   live outside source control are trivial to recreate:
   - `node_modules/` — produced by `npm install` above.
   - `.next/` — build cache; produced by `npm run build` (or the first `next dev` compile).

3. Runtime content notes (not build artifacts):
   - Personal images live in `public/images/` (checked in as normal source).
   - Remote Unsplash imagery is referenced by URL in `lib/data.ts`
     (`REMOTE_ASSETS`, `MACHINES`, `LAB_SHEET_IMG`, and the MataGunung project image).
     `next.config.ts` already allows `images.unsplash.com` / `plus.unsplash.com`.

## How to run the server

Dev server (hot reload, port **3100** — pin with `-p` because the plain `npm run dev` script
defaults to 3000 and falls back to a random port if 3000 is busy):

```bash
npm run dev -- -p 3100
```

Then open http://localhost:3100.

Production checks:

```bash
npm run typecheck   # tsc --noEmit
npm run build       # next build (prerenders the static page)
npm run start       # serves the production build on :3000 (add -- -p 3100 to pin)
```

Detached launch on Windows (used by the preview tooling):

```powershell
Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','-p','3100' `
  -RedirectStandardOutput '<log>.log' -RedirectStandardError '<log>.log.err' `
  -WindowStyle Hidden -PassThru
```
