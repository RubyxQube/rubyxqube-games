# Aesthetic Direction — games.rubyxqube.com

Design lead pass per `/frontend-design`. Locked direction — spec-writer and builder should treat this as the source of truth for look/feel/motion.

## The idea in one line

**REVISION (2026-07-30, Boyd's direction):** The site's primary experience is a **walkable arcade lobby** — first-person navigation like the workspace's Phoenix Stoneworks 3D walkthrough demo (WASD + touch joystick), not a scroll-driven set-piece. You walk through a dim arcade room lined with cabinets, one per game in the catalog. Huff & Puff's cabinet is the one real, lit, playable machine — walk up to it and play "Blow the House Down" right there. The rest of the room holds a few dark, unlit cabinet silhouettes with "COMING SOON" placards — reserved space for future titles, no fabricated names or content (per BRIEF's explicit "no invented placeholder games" rule).

The wolf's-breath motif from the original direction isn't discarded, it's demoted from "drives the whole page" to **atmospheric texture inside the one thing that's earned it**: the H&P cabinet's screen shows the straw-house night scene idling (wolf eyes glowing, a slow breathing pulse to the ambient light), and stepping up to play is what triggers the actual breath-charge mini-game. That keeps the throughline — breath is still what the visitor ultimately controls — without making the whole home page perform one long cutscene before showing any content.

## Why this and not the obvious "indie game site" look

The generic version of this brief is a near-black background with one neon accent and a floating 3D object in the hero — competent, but it's the default for "indie game site" the same way cream+serif+terracotta is the default for "editorial brand." An arcade lobby you actually walk through, where most of the room is dark and waiting to be filled, tells the studio's real story better than a hero animation could: RubyxQube Games has shipped one machine so far, and there's visibly room for more. Leaning into the palette (straw/stick/brick and breath-lit neon) keeps it specific to *this* studio rather than swappable with any other indie launch site.

## Color

Named tokens, sampled/refined against the provided logo files during build (the ruby needs to visually match `RubyxQube_*.png` exactly, not just approximate):

| Name | Hex | Use |
|---|---|---|
| Wolfshade | `#14181A` | Base background — warm-tinted near-black, not tech-black |
| Ember Ruby | `#D31C3F` | Primary accent — matches the brand cube's ruby, CTAs, wolf-eye glow |
| Moonmilk | `#F3EFE6` | Off-white for light mode / body copy on dark — parchment, not stark white |
| Strawgold | `#E3A857` | Low-charge state on the breath meter, straw-house material, hover warmth |
| Brickrust | `#8C4A3A` | High-charge state on the breath meter, brick-house material, shadow depth |
| Pinehollow | `#3A4A3E` | Forest/night ambient — fog, secondary dark surface, sparingly |

Each color maps to something in the story (wolf, brand ruby, parchment page, straw, brick, forest) rather than being picked for contrast alone.

## Type

Deliberately **not** Plus Jakarta Sans (the workspace's default agency font) — the brief asks this site to feel like a different animal from rubyxqube.com, and sharing the same face across both would undercut that. Flagging this as an intentional deviation from `technical-defaults.md`, not an oversight.

- **Display — Fraunces** (variable: optical size + softness axes). Storybook serif with real weight extremes. Set at large optical sizes on headlines only; the softness axis is the trick — headlines can visually "puff" heavier/rounder on load or hover, tying the typeface itself to the breath theme. Used with restraint: hero line, section titles, nothing else.
- **Body — Hanken Grotesk**. Clean humanist grotesque for paragraphs, nav, buttons — legible, a little more game-UI energy than a corporate sans, still calm enough to not fight the display face.
- **HUD/data — Space Mono**. Score, timer, breath-charge %, small tags. Reads as a digital readout — used only where the content is literally a number or status, not for body text.

## Layout concept

Huff & Puff is the studio's first release, not its only one — the site is a catalog, not a single-game microsite. Nav carries a **Games** link (to the flat `/games` list, see below), not a single-title CTA.

**Home = the Arcade Lobby (the signature moment):** Full-bleed R3F room, first-person navigable — WASD on desktop, on-screen joystick on touch, adapted from the Phoenix Stoneworks walkthrough's `PlayerController` pattern (same `matchMedia('(pointer: coarse)')` split, same fly-to-target-position feel, much smaller room so full free-roam collision isn't overkill — a short, mostly-linear space works fine). Dim ambient light (Wolfshade/Pinehollow), a few work-lights. Cabinets line the walls:

- **Huff & Puff's cabinet** — lit, marquee glowing Ember Ruby, screen showing a stylized wolf-eyes/house-silhouette glow that pulses like breathing (an emissive plane + simple shape, not a full nested 3D scene — keeps the lobby's own render cost down). Walking into its interaction radius surfaces a prompt ("Press E to Play" desktop / tap prompt on touch) that navigates into the Huff & Puff detail page, where "Blow the House Down" actually runs (one mini-game implementation, reached from the lobby cabinet or directly via `/games/huff-and-puff` — not two separate builds of the same game).
- **2–3 dark, unlit cabinet silhouettes** — "COMING SOON" placard, faint outline only, no interaction, no invented titles. This is the visual "there's more coming" signal — a real device, not a vague teaser strip.

```
┌───────────────────────────────────────┐
│ [cube]  RUBYXQUBE GAMES   Games  About │ ← nav, transparent over scene
│                                         │
│   (first-person 3D arcade room)        │
│                                         │
│   [dark cabinet]  [LIT H&P CABINET]    │
│   COMING SOON      marquee glowing     │
│                     screen breathing   │
│                                         │
│         WASD / joystick to walk        │
│         approach a cabinet to play     │
└───────────────────────────────────────┘
```

Studio blurb (who RubyxQube Games is) sits as static DOM content below the lobby canvas, reached by scrolling past it — same "quiet by comparison" treatment as About/Press/Contact.

**Games catalog page (`/games`) — the accessible/flat counterpart to the lobby:** a simple grid of game cards driven by the same games data collection — cover art, title, one-line tagline, status badge, click-through to that game's detail page. This is the page reduced-motion users, low-end mobile, and search crawlers land on instead of the 3D lobby; it must carry the same information the lobby shows spatially. One real card today (Huff & Puff); grid must not assume exactly one item.

```
┌───────────────────────────────────────┐
│ [cube]  RUBYXQUBE GAMES   Games  About │
│                                         │
│  OUR GAMES                             │
│  ┌───────────┐  ┌───────────┐         │
│  │ HUFF&PUFF │  │  (empty   │  ...    │
│  │Coming Soon│  │  slot —   │         │
│  │[card art] │  │  grid, not│         │
│  └───────────┘  │  fixed 1) │         │
│                  └───────────┘         │
└───────────────────────────────────────┘
```

**Game detail page mini-game ("Blow the House Down"):** the HUD is the breath meter made literal — a semi-circular dial that shifts Strawgold → Brickrust as it charges, screen-shake + particle burst on release, Space Mono digits for score/timer. This is the same game whether entered from the lobby cabinet or navigated to directly via `/games/huff-and-puff` — one implementation, two entry points. Per-game optional (`hasMinigame: true`), not assumed for every future title's cabinet.

```
┌─────────────────────┐
│ 00:47         SCORE:3│  ← Space Mono
│                       │
│     [3D canvas]       │
│  straw house mid-     │
│      collapse         │
│                       │
│  ▓▓▓▓▓▓░░░░ 62%       │  ← breath dial, gold→rust
│  [ hold to charge ]   │
└─────────────────────┘
```

**About/Press/Contact:** quiet by comparison — this is where restraint pays off. Static layout, no 3D, Wolfshade/Moonmilk only, so the lobby doesn't get diluted by repeating the trick on every page.

## Motion rules

- Ambient atmosphere (dust motes, flickering marquee, breathing screen-glow) and the mini-game's particle bursts are reserved for the lobby and the mini-game — the two places it's earned. Section reveals elsewhere (studio blurb, catalog cards) use a single settle-in (slight rotation + drift, like debris landing) rather than a generic fade-up, but stay subtle.
- Respect `prefers-reduced-motion`: the lobby degrades to a static rendered view of the room (same scene, no walking, no ambient particle motion) with clickable hotspots on each cabinet instead of walk-up-to-interact; the flat `/games` page is always available as the fully-static alternative regardless of motion preference. Mini-game keeps functioning (it's the point of the page) but drops ambient particle decoration under reduced motion.
- No motion on About/Press/Contact beyond standard hover states — deliberate contrast with the lobby.

## Icons

Lucide React per workspace non-negotiable, styled to sit quietly against Wolfshade/Moonmilk — utility only (nav, socials, form), never used as decoration competing with the 3D scene or the wordmark.

## Logo usage (confirms DECISIONS.md #1)

"RubyxQube Games" wordmark (light variant) in nav/hero over the dark 3D scenes; "RubyxQube Studio" wordmark, small, in the footer credit/legal line and press-kit boilerplate.
