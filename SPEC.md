# Technical Spec — games.rubyxqube.com (RubyxQube Games)

Built from BRIEF.md, DECISIONS.md, DESIGN.md (all current as of 2026-07-30, corrected for the multi-game catalog architecture). Everything below is final — no further approval checkpoint; every ambiguity is resolved with a stated assumption rather than left open (see §16).

Project root: `C:\Users\boydi\Projects\rubyxqube-games\` (currently only the .md planning files — greenfield).

---

## 1. Stack decision

React 18 + React Router v6 + Vite 5, custom CSS (no Tailwind), zero-config Vercel deploy — same skeleton as `client-template`, but:
- **Not** Plus Jakarta Sans — DESIGN.md explicitly overrides `technical-defaults.md` with Fraunces / Hanken Grotesk / Space Mono.
- **No chatbot** — skip `ChatWidget.jsx`, `chatConfig.js`, `api/chat.js` entirely (DECISIONS #3).
- **No Supabase/backend** — static site, client-side-only mini-game, no leaderboard/save state.
- **New 3D dependency stack** — `three`, `@react-three/fiber`, `@react-three/drei` (none in client-template).

---

## 2. File structure — every file to create

```
rubyxqube-games/
  package.json
  vite.config.js
  index.html
  .gitignore
  .env.example
  README.md
  public/
    favicon.ico                          (generated from cube mark)
    apple-touch-icon.png
    brand/
      cube-64.png
      games-wordmark-light.png
      games-horizontal-light.png
      games-stacked-light.png
      studio-wordmark-light.png
      studio-horizontal-dark.png
      studio-stacked-dark.png
      games-horizontal-dark.png
    press/
      (same brand PNGs, flat downloadable assets for PressKit.jsx)
    games/
      huff-and-puff/
        cover.jpg
        screenshots/01.jpg ... 05.jpg
  src/
    main.jsx
    App.jsx
    styles.css
    siteConfig.js
    data/
      games.js
    hooks/
      useTheme.js
      useReducedMotion.js
      useSettleIn.js
    components/
      ScrollToTop.jsx
      Layout.jsx
      Navbar.jsx
      Footer.jsx
      ThemeToggle.jsx
      GameCard.jsx
      StatusBadge.jsx
      SteamButton.jsx
      lobby/
        LobbyScene.jsx
        LobbyRoom.jsx
        PlayerController.jsx
        MobileJoystick.jsx
        CabinetLit.jsx
        CabinetLocked.jsx
        InteractionPrompt.jsx
        LobbyReducedMotion.jsx
        useLobbyInput.js
      minigame/
        BlowTheHouseDown.jsx
        MinigameCanvas.jsx
        HouseGeometry.jsx
        HouseModel.jsx
        BreathParticles.jsx
        BreathMeter.jsx
        ScoreTimer.jsx
        StartScreen.jsx
        GameOverScreen.jsx
        useBreathCharge.js
        useGameInput.js
      press/
        PressGameSection.jsx
    pages/
      Home.jsx
      Games.jsx
      GameDetail.jsx
      Studio.jsx
      PressKit.jsx
      Contact.jsx
  api/
    contact.js
```

---

## 3. `games` data schema (`src/data/games.js`)

**CORRECTION (2026-07-30, post-spec fact-check):** Huff & Puff's actual Steam listing is **not** a solo wolf-vs-one-house fairy tale — it's a **3v1 asymmetric multiplayer party game**: three players play pigs who gather straw/sticks/bricks/peppers/cauldrons and fortify shelters by day; one player plays the wolf who trains by day and hunts by night, physically smashing shelters and dragging caught pigs back to a pen. Steam friends lobbies, multiple maps, side modes. **Status is "Coming soon to Early Access"** — not yet released/purchasable. This matches the internal note that the Steam store page just cleared its mandatory 2-week Coming Soon period, not that the game has shipped — "wishlist," not "buy," is the live CTA today.

This does **not** change the site's design direction (DESIGN.md's mood/palette/motion language still fits — "playful, confident, a little mischievous" describes a chaotic party game just as well as a moody solo hunt) and does **not** change the mini-game concept (§7's "Blow the House Down" is a fitting single-player distillation of the wolf's actual night-hunt/shelter-smashing mechanic for a browser demo — keep it, just don't describe it on-page as literally how the multiplayer game plays). It **does** change: the real copy pulled into `games.js`, and the CTA/status framing across every page.

Plain data module — no JSX/component references inside it (component wiring lives in `GameDetail.jsx` via a slug-keyed lookup map, §5). One real entry, using the actual Steam copy fetched 2026-07-30:

```js
const games = [
  {
    slug: "huff-and-puff",
    title: "Huff & Puff",
    tagline: "Build by day. Hunt by night.",
    // Full Steam short description, for use where a longer tagline/subhead fits:
    // "Three pigs gather, craft, and fortify shelters while one wolf trains for the
    //  moonlit huff-and-puff chase in a chaotic 3v1 multiplayer party game."
    description:
      "Huff & Puff is a chaotic asymmetric multiplayer party game where three pigs " +
      "build shelters by day while one wolf trains for the hunt. When night falls, " +
      "the wolf breaks loose with one goal: huff, puff, smash the shelters, catch the " +
      "pigs, and drag them back to the pen. Pigs gather straw, sticks, bricks, peppers, " +
      "and cauldrons to survive the night.",
    keyFeatures: [
      "3v1 Classic Hunt: pigs build, wolf trains, night turns into a chase",
      "Physics-driven shelter destruction",
      "Steam friends lobbies and invite flow",
      "Multiple maps and side modes",
      "Playable pigs and wolf with different movement, tools, and goals",
      "Fast rounds built for yelling, laughing, and last-second escapes",
    ],
    status: "coming-soon",   // NOT "released" — Early Access hasn't launched yet
    releaseDate: null,
    coverImage: "/games/huff-and-puff/cover.jpg",   // sourced from Steam header image, see §16
    screenshots: [ "/games/huff-and-puff/screenshots/01.jpg" /* , more if sourced, see §16 */ ],
    steamUrl: "https://store.steampowered.com/app/4966590/Huff__Puff/",
    hasMinigame: true,
  },
];

export default games;
```

`StatusBadge.jsx` must support a fourth status value: `"coming-soon"` (in addition to `released` / `in-development` / `announced`) — label it "Coming Soon to Early Access" or similar, styled distinctly (e.g. Strawgold, anticipatory, not the "shipped" green/ruby treatment `released` would get). `SteamButton.jsx` label reads **"Wishlist on Steam"** wherever `status === "coming-soon"` (every instance today — Home hero, catalog card, game detail page) rather than a generic "Buy/Wishlist" — there is nothing to buy yet.

**Rule:** `Games.jsx`, `Home.jsx`'s catalog strip, and `PressKit.jsx` all `.map()` over this array — none render a hardcoded single card. Adding game #2 = appending one object + dropping assets in `public/games/<slug>/`.

---

## 4. Routing (`src/App.jsx`)

```jsx
<Route element={<Layout />}>
  <Route path="/"             element={<Home />} />
  <Route path="/games"        element={<Games />} />
  <Route path="/games/:slug"  element={<GameDetail />} />
  <Route path="/studio"       element={<Studio />} />
  <Route path="/press"        element={<PressKit />} />
  <Route path="/contact"      element={<Contact />} />
</Route>
```

`Navbar.jsx` nav links: **Games** (→ `/games`), **Studio** (→ `/studio`), **Press** (→ `/press`) — not a single-title CTA. Logo (games wordmark) links to `/`.

---

## 5. Pages spec

### Home (`src/pages/Home.jsx`)
**REVISED (2026-07-30, Boyd's direction):** Home's signature element is a walkable 3D **arcade lobby**, not a scroll-driven cutscene — see §6.
1. `<LobbyScene />` — full-bleed, fixed-height (not scroll-driven) first-person-navigable 3D room. Sits at the top of the page in its own viewport-height container (not a scroll-stage).
2. Studio blurb section — 2-3 short paragraphs, wolf's-voice tone, static, below the lobby canvas, `useSettleIn` on scroll-in.
3. Games catalog strip — `.map(games)` → `GameCard` grid, "View all games" link → `/games` (the flat, non-3D counterpart to the lobby — same data, accessible entry point).
4. Final CTA band — repeats Steam wishlist button.

### Games catalog (`src/pages/Games.jsx`)
No 3D. Static grid, `useSettleIn` per card. `.map(games)` → `<GameCard game={g} />`: cover image, title, tagline, `<StatusBadge status={g.status} />`, click-through to `/games/${g.slug}`. Grid: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` — no fixed item-count assumption.

### Game detail (`src/pages/GameDetail.jsx`)
`useParams()` → `slug`; `games.find(g => g.slug === slug)`. Not found → "Game not found" + link to `/games`.

Order: cover/header image → `StatusBadge` → title + tagline → `SteamButton` (above the fold, right under title) → description + key features → screenshots gallery (hidden if empty) → conditional mini-game:

```jsx
const MINIGAME_COMPONENTS = { "huff-and-puff": BlowTheHouseDown };
{game.hasMinigame && MINIGAME_COMPONENTS[game.slug] &&
  React.createElement(MINIGAME_COMPONENTS[game.slug])}
```

Keyed by slug so a future game with a different (or no) mini-game doesn't touch this template's structure.

### Studio / About (`src/pages/Studio.jsx`)
Static, no 3D, Wolfshade/Moonmilk only. Who RubyxQube Games is, connection to RubyxQube LLC (link to rubyxqube.com), short founder note, mission/vibe. Draft in Boyd's established voice; flag for a quick read-through before launch.

### Press Kit (`src/pages/PressKit.jsx`)
Static, no 3D. Both logo families as downloads (`<a href="/press/<file>.png" download>`), studio boilerplate paragraph, press contact `boyd@rubyxqube.com`, then `.map(games)` → `<PressGameSection game={g} />`.

### Contact (`src/pages/Contact.jsx`)
Same shape as `client-template/src/pages/Contact.jsx`, copy adjusted for press/business inquiries (no service-area framing). Posts to `/api/contact`. Fields: name, email, message (no phone field). Inline success state, no redirect.

---

## 6. R3F Arcade Lobby scene (`src/components/lobby/`)

**REVISED (2026-07-30, Boyd's direction):** replaces the earlier scroll-driven hero concept entirely. Home's signature 3D moment is now a small, first-person-navigable arcade room — explicitly modeled on `clients/phoenix-stoneworks/src/components/walkthrough/`'s pattern (`WalkthroughCanvas.jsx` → here `LobbyScene.jsx`; `PlayerController.jsx` → adapted, not copied verbatim; `MobileJoystick.jsx` → reused pattern). The room is small and mostly linear (a short hallway/alcove of cabinets, not an open free-roam floor) specifically so a simplified controller — walk forward/back/strafe with simple AABB wall clamping, no jumping, no complex physics — is sufficient; don't port PSW's more elaborate camera fly-to/inspect-pose system, this doesn't need it.

**`LobbyScene.jsx`** — `<Canvas shadows dpr={[1,1.5]}>` sized to fill a fixed-height container (`height: 70svh` on desktop, `60svh` on mobile — NOT a scroll-stage, this is a fixed viewport panel at the top of Home). `<Suspense fallback={<LoadingOverlay />}>`. Lighting: low ambient, one or two warm point lights simulating work-lights, plus each lit cabinet contributing its own small point light (Ember Ruby, low intensity) — no HDR `<Environment>` needed, this is an interior space, not the open-air clearing the old hero was.

**`LobbyRoom.jsx`** — primitive-geometry room shell: box floor/walls/ceiling, Wolfshade/Pinehollow materials, simple baked-feeling AO via a couple of soft-shadow point lights (no need for real-time GI). Cabinet slots positioned along one or both walls.

**`PlayerController.jsx`** — adapted from PSW's controller: `useThree`/`useFrame`-driven camera movement.
- Desktop: WASD (or arrow keys) for forward/back/strafe, mouse-look via pointer lock or simple drag-to-look (builder's call — pointer lock is closer to PSW's precedent, drag-to-look is friendlier for a marketing site visitor who didn't expect to click-to-lock their cursor; **recommend drag-to-look / no pointer-lock** for this lower-commitment context, flagged as a deliberate simplification from PSW's full pointer-lock FPS feel).
- Touch: `<MobileJoystick />` for movement (same component pattern as PSW) + drag-to-look on the canvas itself.
- Movement clamped to a simple bounding box (the room's interior) — no navmesh, no collision against cabinet geometry beyond a basic radius push-out so the player can't clip through a cabinet.
- **`useLobbyInput.js`** — normalizes WASD/arrow keydown state + joystick vector into one movement direction per frame, decoupled from the specific input method (mirrors `useGameInput.js`'s "one hook, multiple input sources" pattern from §7).

**`CabinetLit.jsx`** (Huff & Puff, the one real entry) — cabinet body (box + bezel primitives), a marquee strip (emissive Ember Ruby, pulsing intensity ~4s sine period — the one surviving piece of the original "breathing" motif), and a screen (emissive plane, dark base color, a simple flat-shaded wolf-eyes/silhouette shape in front of it, NOT a nested mini 3D scene/render-target — keep this cheap to render). `<InteractionPrompt>` appears (billboarded DOM-in-3D or a simple screen-space overlay positioned via projected coordinates) when the player's distance to the cabinet drops under a threshold. Confirming the prompt (Enter/E key, or tap on touch) does `navigate('/games/huff-and-puff')` via React Router — the mini-game itself only exists once, on the game detail page (§7), reached either from here or directly by URL.

**`CabinetLocked.jsx`** — 2–3 instances, unlit/dark variant of the same cabinet primitive (desaturated, no marquee glow, a static "COMING SOON" placard mesh or DOM overlay). No interaction, no invented game names or content — purely a "there's more coming" visual per BRIEF's explicit no-fabrication rule.

**`LobbyReducedMotion.jsx`** — used when `useReducedMotion()` is true: same `LobbyScene`/`LobbyRoom`/cabinets rendered once with a fixed static camera framing the room (no `PlayerController`, no walk loop), plus simple DOM hotspot buttons overlaid at each cabinet's screen position ("Play Huff & Puff" / "Coming soon" labels) so the same content and the same route (`/games/huff-and-puff`) is reachable without requiring movement input.

---

## 7. R3F Mini-game — "Blow the House Down" (`src/components/minigame/`)

**State machine (`BlowTheHouseDown.jsx`):** `ready` → `playing` → `gameover`

- **`ready`**: `StartScreen` with instructions + Start button. Timer doesn't run until Start is pressed.
- **`playing`**: 60.0s countdown from Start. Per-house sub-states: `idle` → `charging` → `released` → `collapsing` → `cleared`.
- **`gameover`**: `GameOverScreen score={score} onPlayAgain={reset}`. No persistence — full reset on Play Again/unmount.

**Constants:**
```js
const CHARGE_MS = 900;
const MIN_RELEASE_THRESHOLD = 0.25;
const HITS_TO_COLLAPSE = { straw: 1, sticks: 2, bricks: 3 };
const HOUSE_CYCLE = ["straw", "sticks", "bricks"]; // repeats
```
Release ≥25% charge = exactly 1 hit (charge% is HUD feedback + whiff-gate, not a damage multiplier — keeps v1 buildable without balancing). Each hit: screen-shake (~200ms camera jitter) + particle burst (skipped under reduced-motion) + `HouseModel.stage++`. Final hit: collapse transform, `score += 1`, ~500ms pause, next house (cycle wraps), meter resets.

**`HouseModel.jsx`** — props `{ type, stage, maxStage }`. Straw reuses `HouseGeometry`; sticks = cylinder-lattice bundle; bricks = box construction, flat Brickrust color (textured brick = future enhancement, not required). Transform lerps (tilt/drop/scale) toward per-stage target table via `useFrame`. `key={houseIndex}` on the parent for clean remounts.

**`MinigameCanvas.jsx`** — separate lightweight `<Canvas dpr={[1,1.5]}>`, fixed camera (no orbit controls), three-light rig only, **no HDR** (zero asset footprint, never blocks on fetch). `<Suspense fallback={<LoadingSpinner />}>` as formality.

**`useGameInput.js`** — one hook wired to both inputs simultaneously:
- `keydown`/`keyup` on `e.code === 'Space'`, `preventDefault()`, guard `e.repeat`.
- `pointerdown`/`pointerup`/`pointercancel`/`pointerleave` on a single always-visible "hold to charge" button (Pointer Events unify mouse + touch — one code path).
- `matchMedia('(pointer: coarse)')` used only to pick instruction copy ("hold spacebar" vs "hold the button below"), not to fork logic.

**`BreathMeter.jsx`** (DOM) — semi-circular SVG/conic-gradient dial, Strawgold→Brickrust as charge rises, Space Mono `%` overlay.

**`ScoreTimer.jsx`** (DOM) — top bar, Space Mono, `mm:ss` + `SCORE:n`.

---

## 8. CSS tokens, fonts, light/dark mode

**Color tokens:**

```css
:root{
  --bg: #14181A;              /* Wolfshade */
  --text: #F3EFE6;            /* Moonmilk */
  --muted: rgba(243,239,230,0.60);
  --line: rgba(243,239,230,0.12);

  --accent: #D31C3F;          /* Ember Ruby — verify against logo PNGs during build */
  --accent-hover: #B01732;
  --accent-dim: rgba(211,28,63,0.12);

  --strawgold: #E3A857;
  --brickrust: #8C4A3A;
  --pinehollow: #3A4A3E;

  --radius: 14px;
  --max: 1120px;
}

[data-theme="light"]{
  --bg: #F3EFE6;
  --text: #14181A;
  --muted: rgba(20,24,26,0.60);
  --line: rgba(20,24,26,0.10);
  --accent-hover: #98122A;
}
```

Default theme = **dark** (matches the night-clearing hero and `useTheme.js`'s existing default).

**Fonts (`index.html`):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..900,0..100&family=Hanken+Grotesk:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
```
```css
body{ font-family: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif; }
h1, h2, .display{ font-family: 'Fraunces', serif; font-variation-settings: 'SOFT' 0; transition: font-variation-settings 0.4s ease; }
.display:hover, .hero-reveal h1{ font-variation-settings: 'SOFT' 60; }
.hud, .score, .timer, .breath-pct, .tag{ font-family: 'Space Mono', monospace; }
```
Verify Fraunces' `SOFT` axis order against fonts.google.com/specimen/Fraunces before pinning the query string; if the hosted endpoint doesn't animate cleanly, self-host the variable `.woff2` in `src/assets/fonts/` with local `@font-face` instead (same CSS otherwise).

**Anti-flash script (`index.html`, first script):**
```html
<script>
  (function(){
    try{
      var s=localStorage.getItem('color-scheme');
      if(s==='light'||s==='dark'){document.documentElement.setAttribute('data-theme',s);return;}
    }catch(e){}
    document.documentElement.setAttribute('data-theme','dark');
  })();
</script>
```
Falls back to `'dark'` (not `'light'` as in rubyxqube.com's copy — that mismatches its own hook default, don't propagate the mismatch).

`useTheme.js` — copy from `rubyxqube/src/hooks/useTheme.js` (already defaults `'dark'`).

**Motion — `useSettleIn.js`:** IntersectionObserver hook → `{ ref, inView }`.
```css
.settle-in{ opacity:0; transform: rotate(-2deg) translateY(16px); transition: opacity .5s ease-out, transform .5s ease-out; }
.settle-in.in-view{ opacity:1; transform:none; }
```
Applied to: Home's studio-blurb, catalog-strip cards, Games page cards, GameDetail content blocks. **Not** applied to About/Studio, Press Kit, Contact (DESIGN.md: "quiet by comparison").

`useReducedMotion.js` — wraps `matchMedia('(prefers-reduced-motion: reduce)')`. Consumed by `Home.jsx` (picks `HeroScene` vs `HeroReducedMotion`) and `BlowTheHouseDown.jsx` (skips particle bursts only, game stays fully playable).

---

## 9. Logo asset usage

| Context | File |
|---|---|
| Navbar (dark scenes/pages) | `games-wordmark-light.png` or `games-horizontal-light.png` |
| Hero reveal | `games-horizontal-light.png` |
| Footer credit / legal | `studio-wordmark-light.png` (small, dark footer bg) |
| Press kit boilerplate / Steam publisher field | "RubyxQube Studio" (text) |
| Press kit downloads | all 8 Games + Studio PNGs (light+dark × horizontal/stacked/wordmark) |
| Favicon / apple-touch-icon | `rubyxqube_cube_600.png` (resized) |
| Footer credit icon | `cube-64.png`, 16px inline next to "Built and powered by RubyxQube" |

Copy the 14 source PNGs from `C:\Users\boydi\Downloads\logos\logos\` into `src/assets/brand/` (build-time imports) **and** duplicate into `public/brand/` + `public/press/` (static download links need raw files served, not bundled).

---

## 10. `siteConfig.js`

```js
const siteConfig = {
  businessName: "RubyxQube Games",
  studioName:   "RubyxQube Studio",
  tagline:      "Fairy tales, from the predator's side.",
  email:        "boyd@rubyxqube.com",
  domain:       "https://games.rubyxqube.com",
  phone:        null,
  address:      null,
  serviceArea:  null,
  parentSite:   "https://rubyxqube.com",
  credit:       "Built and powered by RubyxQube",
};
export default siteConfig;
```
`Navbar.jsx`/`Footer.jsx` render conditionally around null `phone`/`address` (no `tel:` link when null) — same graceful-degrade pattern as `client-template/Footer.jsx`'s social links.

---

## 11. `api/contact.js`

Simplest version meeting the SEO+contact standard — ntfy + Resend only (no SMS/SignalWire; not a client lead-gen site with a cell number to text):

```js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, message, _hp } = req.body || {};
  if (_hp) return res.status(200).json({ ok: true });
  if (!name || !message) return res.status(400).json({ error: "name and message required" });

  const alertText = [
    `New contact form message — games.rubyxqube.com`,
    ``,
    `Name:    ${name}`,
    email ? `Email:   ${email}` : null,
    ``,
    message,
  ].filter(Boolean).join("\n");

  const { NTFY_TOPIC } = process.env;
  if (NTFY_TOPIC) {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: "POST",
      headers: { "Title": "New message — RubyxQube Games", "Priority": "high", "Tags": "bell,video_game", "Content-Type": "text/plain" },
      body: alertText,
    }).catch(err => console.error("ntfy error:", err.message));
  }

  const { RESEND_API_KEY, ALERT_EMAIL, FROM_EMAIL } = process.env;
  if (RESEND_API_KEY && ALERT_EMAIL) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL || "onboarding@resend.dev",
        to: [ALERT_EMAIL],
        subject: `New message — ${name}`,
        text: alertText,
        ...(email ? { reply_to: email } : {}),
      }),
    }).catch(err => console.error("Resend error:", err.message));
  }

  return res.status(200).json({ ok: true });
}
```

---

## 12. `package.json` dependencies to add

```json
"dependencies": {
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.0",
  "three": "^0.169.0",
  "@react-three/fiber": "^8.17.0",
  "@react-three/drei": "^9.114.0",
  "lucide-react": "latest"
},
"devDependencies": {
  "@vitejs/plugin-react": "^4.3.1",
  "vite": "^5.4.0"
}
```
Pin exact versions at install time (`npm install <pkg>@latest`) rather than trusting hand-typed numbers above.

`.env.example`:
```
NTFY_TOPIC=
RESEND_API_KEY=
ALERT_EMAIL=boyd@rubyxqube.com
FROM_EMAIL=
```

---

## 13. Vercel env vars

| Variable | Value source |
|---|---|
| `NTFY_TOPIC` | Boyd's shared push topic (vault) |
| `RESEND_API_KEY` | Resend account (vault) |
| `ALERT_EMAIL` | `boyd@rubyxqube.com` |
| `FROM_EMAIL` | a Resend-verified sender on `rubyxqube.com` (reuse existing verified sender) |

No `ANTHROPIC_API_KEY`, `SUPABASE_*`, or `SIGNALWIRE_*` — not applicable.

---

## 14. Mobile requirements (390px baseline)

- Nav collapses to hamburger/stacked menu at ≤640px.
- Lobby: `60svh` fixed-height canvas on mobile (vs `70svh` desktop) — avoids the joystick/prompt UI feeling cramped against mobile browser chrome. `<MobileJoystick>` bottom-left, thumb-reachable, ≥64px control radius; interaction prompt/tap-to-play button bottom-right, doesn't overlap the joystick.
- Mini-game: "hold to charge" button ≥64px tap target, thumb-reachable bottom-center, doesn't overlap the breath meter. Fixed camera framing keeps the house fully in view at 390px — test at that width.
- Below-lobby CTA/studio-blurb buttons stack vertically on narrow viewports, full-width tap targets.
- Games catalog grid collapses to 1 column at 390px naturally via `auto-fill`.
- No fixed pixel container widths — `--max: 1120px` with fluid padding.

---

## 15. SEO + contact form standard

- Unique `<title>`/`<meta description>` per page.
- `og:title/description/image/url` per page (GameDetail sets `og:image` to that game's `coverImage`).
- `<link rel="canonical">` per page.
- JSON-LD: `Organization` schema (Home/Studio) instead of `LocalBusiness` (no service area fits); `VideoGame` schema on each GameDetail (`name`, `description`, `image`, `publisher`: RubyxQube Studio, `applicationCategory`) instead of the usual local-business pattern.
- One `<h1>` per page, no skipped heading levels.
- All `<img>` have descriptive `alt` text.
- Contact form posts to `/api/contact`, inline success message, no redirect.

---

## 16. Resolved assumptions (final — no further approval needed)

1. **Home hero** = a first-person-navigable arcade lobby (§6), per Boyd's direct steer 2026-07-30 ("kind of like an arcade lobby... kind of like the PSW demo site"), replacing the earlier scroll-driven straw-house cutscene concept entirely. The straw-house/wolf-eyes assets and breath motif survive only inside the mini-game (§7) and as decorative texture on the H&P cabinet's screen — not as the page's whole opening sequence. Controller pattern adapted from `clients/phoenix-stoneworks/src/components/walkthrough/PlayerController.jsx`, deliberately simplified (no pointer-lock FPS feel, no inspect fly-to poses, small linear room instead of open free-roam) since this is a lightweight marketing moment, not a product configurator.
2. **Huff & Puff real content** — fetched directly from the live Steam store page 2026-07-30 (verbatim description/features baked into §3). This also surfaced that the game is a **3v1 multiplayer party game, Coming Soon to Early Access** — not a solo game and not yet released — which changes `status`/CTA copy throughout (§3) but not the design direction or mini-game concept. Only two images were found on the store page: a header/capsule image and one community-hub image, no dedicated screenshot gallery yet. Builder should download both via `curl` in Bash:
   - `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4966590/71f67107a4353f9b0f31245207b2e63acfa0c708/header.jpg` → `public/games/huff-and-puff/cover.jpg`
   - `https://shared.akamai.steamstatic.com/community_assets/images/apps/4966590/249831dfeb2ec296bb9adcd40ffb5564e5969e79.jpg` → `public/games/huff-and-puff/screenshots/01.jpg`

   That's the full screenshot gallery for v1 (one image) — the gallery section should render gracefully with just one image rather than assuming a multi-image carousel. Boyd should skim the pulled copy once before launch since it's a direct pull, not hand-written, and re-check `status` closer to actual Early Access launch (this spec is a point-in-time snapshot).
3. **Fraunces `SOFT` axis** — verify at build time; self-host fallback documented in §8 if needed.
4. **`<Environment preset="night">`** (drei procedural) instead of a bespoke HDR for v1 — flag if it reads too flat later.
5. **Studio founder-note copy** — drafted in Boyd's established voice during build; flag for a read-through before launch.
6. **No SMS alert channel** on the contact form — ntfy + email only, deliberate simplification for a low-volume press-inquiry form.
