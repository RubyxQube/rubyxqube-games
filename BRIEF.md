# Brief: games.rubyxqube.com — RubyxQube Games Studio Site

**Type:** New site (greenfield)
**Status:** Approved with sensible defaults on open questions (Boyd delegated — see DECISIONS.md)

---

**Client/Brand:** RubyxQube Games (sub-brand of RubyxQube LLC)
**Business type:** Indie game development studio — sister brand to the existing web design/AI agency at rubyxqube.com
**Location/service area:** N/A — global audience (gamers, press, Steam wishlisters), not a local-service business
**Domain:** games.rubyxqube.com (subdomain of rubyxqube.com)

**Goal of the site:** Get a visitor to wishlist/buy Huff & Puff on Steam, and leave with the impression that RubyxQube Games is a real, playful, technically capable studio with a growing catalog worth following.

**IMPORTANT — correction from Boyd (2026-07-30):** This is NOT a single-game site with Huff & Puff hardcoded as "the" flagship. RubyxQube Games is building multiple titles — Huff & Puff is the first release, not the only one. The site's information architecture must be a **games catalog/portfolio**, built so adding game #2, #3, etc. later is a content addition, not a page-structure rewrite. Do not bake "Huff & Puff" into the nav, layout, or routing as a singular permanent fixture — it's the first (and currently only) entry in a `games` collection that the site is structured to grow.

---

## Pages needed

- [ ] **Home** — 3D-driven hero establishing the studio's personality (not a specific game's personality), a "latest release" callout that currently surfaces Huff & Puff but is structurally just "most recent/featured entry in the catalog," brief studio blurb, and a link into the full games catalog
- [ ] **Games (catalog/index)** — the studio's game library. Currently one card (Huff & Puff, coming soon to Early Access — see SPEC.md §3 correction), with the layout built to hold many — this is where "more coming" lives as real catalog entries (status: coming-soon / released / in-development / announced), not a vague teaser strip bolted onto Home
- [ ] **Game detail page (repeatable template, not a one-off)** — driven by a per-game data entry (slug, title, tagline, description, screenshots, Steam URL, status, optional embedded mini-game component). Huff & Puff is the first instance: `/games/huff-and-puff`, with the full showcase — description, screenshots, Steam wishlist/buy CTA, and the embedded "Blow the House Down" mini-game (the mini-game is a per-game optional feature, not assumed for every future title)
- [ ] **Studio / About** — who RubyxQube Games is, the connection to RubyxQube LLC (the agency), a short founder note from Boyd, mission/vibe — framed around the studio, not any single game
- [ ] **Press Kit** — logos (both lockup families), studio boilerplate, press contact, plus a per-game section (screenshots, description) that currently has one entry and is built to add more
- [ ] **Contact** — press/business inquiries form (standard SEO + contact form requirement applies to every site we ship)

---

## Must-have content

- Steam store link: https://store.steampowered.com/app/4966590/Huff__Puff/
- Huff & Puff game description, key features, screenshots (no trailer video exists yet — checked Downloads, none found; static Steam screenshots only for v1)
- Both logo families already delivered at `C:\Users\boydi\Downloads\logos\logos\`
- Founder/studio bio (Boyd) — short, tying the studio to RubyxQube's existing agency credibility
- Contact: boyd@rubyxqube.com

---

## The Mini-Game — "Blow the House Down" (locked for v1)

Small browser-playable arcade game themed to Huff & Puff. Player holds a button (spacebar desktop, press-and-hold touch on mobile) to charge the wolf's breath meter, releases to blow down a pig's house. Three house types cycle in increasing difficulty (straw → sticks → bricks, bricks take multiple hits). Score = houses blown down in a 60-second window. No physics simulation — a pre-built collapse animation per house type is enough for v1.

**Where it lives:** Embedded on the Huff & Puff game detail page (not Home, not the Games catalog index). Home keeps a lighter ambient 3D scene (rotating cube/logo, mood lighting) so it loads fast as a studio landing page, not a single-game one; the playable game is the payoff on that specific game's detail page.

**Out of scope for v1:** persistent leaderboards, multiplayer, backend/Supabase involvement. Pure client-side scene, no save state.

---

## Tone and aesthetic direction

- Playful, confident, a little mischievous — reflect the wolf/pig theme without being childish. Studio site, not a kids' game page.
- 3D/WebGL should feel like part of the browsing experience (interactive, game-like navigation), not a decorative hero flourish bolted onto a flat page.
- Distinct from rubyxqube.com's agency polish — more energetic, more game-industry — while still part of the same brand family (shared cube mark, shared color DNA where sensible).
- Final direction locked via `/frontend-design` — see DECISIONS.md.

---

## Success looks like

- Home and the Huff & Puff game detail page load with a working 3D scene on both desktop and mobile, no crashes on lower-end phones
- The mini-game is playable start-to-finish (charge, release, house falls, score tracked) on both mouse/keyboard and touch
- Steam wishlist/buy CTA visible and clickable from Home and the game detail page without scrolling past the fold
- Press kit has downloadable logo assets and a boilerplate blurb Boyd can hand to a journalist with zero follow-up questions
- Site meets workspace non-negotiables: light/dark mode, mobile-first, Lucide icons, SEO + contact form, "Built and powered by RubyxQube" footer credit
- Feels like a game studio with a catalog, not a single-game site or an agency site with a game bolted on
- **Adding game #2 later is a data/content change (new entry in the games collection + assets), not a rebuild of the Games index, nav, or routing**

---

## Out of scope (this build)

- Multiplayer or leaderboard functionality for the mini-game
- Actual content for future titles beyond Huff & Puff (the Games catalog structure must support them, but we're not inventing placeholder games — one real entry for v1)
- Any e-commerce/checkout on this site (all purchases route to Steam)
- Chatbot (see DECISIONS.md — defaulted to no chatbot for v1)
