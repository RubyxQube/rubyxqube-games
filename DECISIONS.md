# Open questions from story-writer — resolved 2026-07-30

Boyd delegated ("you know what i want, i trust you to do what you need to do") — resolving these with sensible defaults rather than pausing for approval, per his standing preference to work autonomously. Flagging here so any can be revisited on request.

1. **Logo usage — RubyxQube Games vs RubyxQube Studio:** Going with "RubyxQube Games" as the primary site-facing brand (header, hero, nav), "RubyxQube Studio" reserved for dev/publisher credit lines (footer fine print, press kit boilerplate, Steam publisher field). Low-risk/reversible if wrong.

2. **3D technical approach:** Building fresh with React Three Fiber + `@react-three/drei` (need to add drei — not in client-template or rubyxqube's deps). Adapting *patterns* from Phoenix Stoneworks' walkthrough (Canvas/Suspense setup, lighting rig, mobile touch-vs-desktop control split) — not the FPS PlayerController itself, which is overkill for a marketing site. Full decision lives in the spec.

3. **Chatbot:** No chatbot for v1. This isn't a lead-gen local-service site — standard lead-capture pattern doesn't fit. Can revisit as a fun in-character (wolf) bot later if Boyd wants one.

4. **Trailer/screenshots:** Checked `C:\Users\boydi\Downloads\` for video assets — none found. V1 ships with Steam's static screenshots only. Flag to Boyd if a trailer gets produced later, game page should get a slot for it.

5. **Project folder location:** `C:\Users\boydi\Projects\rubyxqube-games\` — consistent with existing top-level naming (`rubyxqube`, `rubyxqube-app`), distinct from `games-hub` (unrelated mobile/Godot games) to avoid confusion.

6. **Mini-game concept:** Locked in "Blow the House Down" as proposed — see BRIEF.md. Small, on-theme, no backend needed, buildable in v1 scope.
