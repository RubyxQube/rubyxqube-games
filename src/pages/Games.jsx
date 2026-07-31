import GameCard from "../components/GameCard";
import useDocumentHead from "../hooks/useDocumentHead";
import siteConfig from "../siteConfig";
import games from "../data/games";

/**
 * Games catalog — the flat, always-accessible counterpart to the 3D lobby.
 * No 3D. .map(games) -> GameCard grid, auto-fill so it never assumes an
 * exact item count.
 */
export default function Games() {
  useDocumentHead({
    title: `Games — ${siteConfig.businessName}`,
    description: "The RubyxQube Games catalog — Huff & Puff and everything we're building next.",
    url: `${siteConfig.domain}/games`,
  });

  return (
    <section className="section">
      <span className="eyebrow">Catalog</span>
      <h1>Our Games</h1>
      <p className="section-sub">
        Huff & Puff is our first release. This is the studio's whole catalog — a growing
        one, not a single-game microsite.
      </p>
      <div className="games-grid">
        {games.map((g) => <GameCard key={g.slug} game={g} />)}
      </div>
    </section>
  );
}
