import PressGameSection from "../components/press/PressGameSection";
import useDocumentHead from "../hooks/useDocumentHead";
import siteConfig from "../siteConfig";
import games from "../data/games";

// All 14 source PNGs, copied verbatim into public/press/ for raw download
// links (unbundled — these need to be real files on disk, not build-time
// imports). "Games" family = light/dark x horizontal/stacked/wordmark
// (no _studio suffix); "Studio" family = the same set with the _studio
// suffix, reserved for dev/publisher credit lines.
const DOWNLOADS = [
  { file: "RubyxQube_horizontal_light.png", label: "Games — Horizontal (light)" },
  { file: "RubyxQube_horizontal_dark.png", label: "Games — Horizontal (dark)" },
  { file: "RubyxQube_stacked_light.png", label: "Games — Stacked (light)" },
  { file: "RubyxQube_stacked_dark.png", label: "Games — Stacked (dark)" },
  { file: "RubyxQube_wordmark_light.png", label: "Games — Wordmark (light)" },
  { file: "RubyxQube_wordmark_dark.png", label: "Games — Wordmark (dark)" },
  { file: "RubyxQube_horizontal_light_studio.png", label: "Studio — Horizontal (light)" },
  { file: "RubyxQube_horizontal_dark_studio.png", label: "Studio — Horizontal (dark)" },
  { file: "RubyxQube_stacked_light_studio.png", label: "Studio — Stacked (light)" },
  { file: "RubyxQube_stacked_dark_studio.png", label: "Studio — Stacked (dark)" },
  { file: "RubyxQube_wordmark_light_studio.png", label: "Studio — Wordmark (light)" },
  { file: "RubyxQube_wordmark_dark_studio.png", label: "Studio — Wordmark (dark)" },
  { file: "rubyxqube_cube_1000.png", label: "Cube mark (1000px)" },
  { file: "rubyxqube_cube_600.png", label: "Cube mark (600px)" },
];

export default function PressKit() {
  useDocumentHead({
    title: `Press Kit — ${siteConfig.businessName}`,
    description: "Logos, boilerplate, and screenshots for RubyxQube Games and Huff & Puff.",
    url: `${siteConfig.domain}/press`,
  });

  return (
    <section className="section">
      <span className="eyebrow">Press Kit</span>
      <h1>Press Kit</h1>

      <div className="press-boilerplate">
        <h2 style={{ fontSize: 20 }}>Boilerplate</h2>
        <p>
          RubyxQube Studio is an indie game studio based in the Treasure Valley, Idaho — the game
          development arm of RubyxQube LLC. Its first release, Huff & Puff, is a chaotic 3v1
          asymmetric multiplayer party game where three pigs build shelters by day while one wolf
          hunts them by night. Huff & Puff is Coming Soon to Early Access on Steam.
        </p>
        <h2 style={{ fontSize: 20, marginTop: 24 }}>Press Contact</h2>
        <p>
          Boyd Querubin — <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </p>
      </div>

      <h2 style={{ marginTop: 48 }}>Logo Downloads</h2>
      <div className="press-downloads">
        {DOWNLOADS.map((d) => (
          <a key={d.file} href={`/press/${d.file}`} download className="card press-download-card">
            <img src={`/press/${d.file}`} alt={d.label} />
            <span className="filename">{d.label}</span>
          </a>
        ))}
      </div>

      {games.map((g) => <PressGameSection key={g.slug} game={g} />)}
    </section>
  );
}
