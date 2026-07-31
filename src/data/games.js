/**
 * games.js — the studio's catalog. Plain data, no JSX/component references
 * (component wiring — e.g. mini-games — lives in GameDetail.jsx via a
 * slug-keyed lookup map). Games.jsx, Home.jsx's catalog strip, and
 * PressKit.jsx all .map() over this array — none render a hardcoded card.
 * Adding game #2 = appending one object here + assets in public/games/<slug>/.
 */

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
    coverImage: "/games/huff-and-puff/cover.jpg",
    screenshots: [
      "/games/huff-and-puff/screenshots/01.jpg",
      "/games/huff-and-puff/screenshots/02.jpg",
      "/games/huff-and-puff/screenshots/03.jpg",
      "/games/huff-and-puff/screenshots/04.jpg",
      "/games/huff-and-puff/screenshots/05.jpg",
    ],
    steamUrl: "https://store.steampowered.com/app/4966590/Huff__Puff/",
    hasMinigame: true,
  },
];

export default games;
