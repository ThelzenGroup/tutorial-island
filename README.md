# 🏝️ Tutorial Island — Learn to Hack, Safely

A beginner-friendly, **gamified Capture-the-Flag (CTF)** that teaches real
offensive-security skills to people with *zero* networking or programming
background. Every challenge runs in a self-contained browser sandbox, starts
trivially easy, and explains the real-world skill once you solve it.

> ⚖️ Everything here is **simulated** and self-contained. The skills transfer to
> real pentesting, but you should only ever test systems you own or have written
> permission to test.

## What you learn

| # | Level | Teaches |
|---|-------|---------|
| 1 | Hidden in Plain Sight | Viewing a page's HTML source (Ctrl+U) |
| 2 | Whispered Secret | Inspecting cookies & storage with DevTools |
| 3 | Backwards Day | Encoding (Base64) vs. real encryption |
| 4 | The Forgotten Door | Recon & content discovery (`robots.txt`) |
| 5 | Weak Lock | Why you can never trust client-side security |

Find the hidden `FLAG{...}` in each sandbox and submit it to earn XP and badges.
Progress is saved in your browser (localStorage).

## How it works

- Each level is a self-contained module in [`src/levels`](src/levels) that
  exports a `Level` (metadata, briefing, hints, debrief) plus a `Sandbox`
  React component (the interactive playground).
- Game state (solved levels, XP, badges, hints) lives in a React context backed
  by `localStorage` — see [`src/game/progress.tsx`](src/game/progress.tsx).
- Flag checking is lenient (case-insensitive, accepts the bare inner text) — see
  [`src/game/flag.ts`](src/game/flag.ts).

### Adding a new level

1. Create `src/levels/myLevel.tsx` exporting a `Level` with a `Sandbox`.
2. Register it in [`src/levels/index.ts`](src/levels/index.ts).
3. Levels unlock in `order`, so set a sensible `order`/`difficulty`.

## Develop

```bash
npm install
npm run dev      # start the dev server
npm run lint     # eslint
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

Built with React + Vite + TypeScript + Tailwind CSS v4.
