# RubyxQube Games — games.rubyxqube.com

Studio/portfolio site for RubyxQube Games (sub-brand of RubyxQube LLC). React 18 + React Router v6 + Vite 5, custom CSS, React Three Fiber for the arcade lobby and the "Blow the House Down" mini-game.

Built from `SPEC.md`, `DESIGN.md`, `BRIEF.md`, `DECISIONS.md` in this folder — read those for the full rationale.

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build
```

## Structure

- `src/data/games.js` — the games catalog data. Add game #2 by appending an object here and dropping assets in `public/games/<slug>/`.
- `src/components/lobby/` — the first-person-walkable arcade lobby (Home page hero).
- `src/components/minigame/` — "Blow the House Down", embedded on the Huff & Puff game detail page.
- `api/contact.js` — Vercel serverless function, ntfy + Resend alerts on contact form submit.

## Env vars (Vercel)

```
NTFY_TOPIC=
RESEND_API_KEY=
ALERT_EMAIL=boyd@rubyxqube.com
FROM_EMAIL=
```

## Deploy

Vercel, zero-config (Vite auto-detected). SPA rewrite in `vercel.json`.
