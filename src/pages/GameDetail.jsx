import { useParams, Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import SteamButton from "../components/SteamButton";
import BlowTheHouseDown from "../components/minigame/BlowTheHouseDown";
import useSettleIn from "../hooks/useSettleIn";
import useDocumentHead from "../hooks/useDocumentHead";
import useJsonLd from "../hooks/useJsonLd";
import siteConfig from "../siteConfig";
import games from "../data/games";

// Keyed by slug so a future game with a different (or no) mini-game
// doesn't touch this template's structure.
const MINIGAME_COMPONENTS = { "huff-and-puff": BlowTheHouseDown };

export default function GameDetail() {
  const { slug } = useParams();
  const game = games.find((g) => g.slug === slug);
  const content = useSettleIn();

  useDocumentHead(
    game
      ? {
          title: `${game.title} — ${siteConfig.businessName}`,
          description: game.tagline,
          url: `${siteConfig.domain}/games/${game.slug}`,
          image: `${siteConfig.domain}${game.coverImage}`,
        }
      : { title: `Game not found — ${siteConfig.businessName}` }
  );

  useJsonLd(
    game
      ? {
          "@context": "https://schema.org",
          "@type": "VideoGame",
          name: game.title,
          description: game.description,
          image: `${siteConfig.domain}${game.coverImage}`,
          applicationCategory: "Game",
          publisher: { "@type": "Organization", name: siteConfig.studioName },
          url: `${siteConfig.domain}/games/${game.slug}`,
        }
      : null
  );

  if (!game) {
    return (
      <section className="section not-found">
        <h1>Game not found</h1>
        <p style={{ marginBottom: 24 }}>We couldn't find that one — check out the full catalog instead.</p>
        <Link to="/games" className="btn btn-primary">Back to Games</Link>
      </section>
    );
  }

  const MiniGame = game.hasMinigame ? MINIGAME_COMPONENTS[game.slug] : null;

  return (
    <section className="section">
      <img src={game.coverImage} alt={`${game.title} cover art`} className="game-detail-header" />

      <div className={`settle-in${content.inView ? " in-view" : ""}`} ref={content.ref}>
        <div className="game-detail-meta">
          <StatusBadge status={game.status} />
        </div>
        <h1>{game.title}</h1>
        <p className="game-detail-tagline">{game.tagline}</p>

        <SteamButton game={game} />

        <p style={{ marginTop: 32, fontSize: 16, color: "var(--text)", maxWidth: 680 }}>{game.description}</p>

        {game.keyFeatures?.length > 0 && (
          <ul className="game-detail-features">
            {game.keyFeatures.map((f) => <li key={f}>{f}</li>)}
          </ul>
        )}

        {game.screenshots?.length > 0 && (
          <div className="screenshot-gallery">
            {game.screenshots.map((src, i) => (
              <img key={src} src={src} alt={`${game.title} screenshot ${i + 1}`} loading="lazy" />
            ))}
          </div>
        )}
      </div>

      {MiniGame && <MiniGame />}
    </section>
  );
}
