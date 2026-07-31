import StatusBadge from "../StatusBadge";
import SteamButton from "../SteamButton";

/**
 * PressGameSection — per-game press section (screenshots, description).
 * PressKit.jsx .map()s over the games collection into these.
 */
export default function PressGameSection({ game }) {
  return (
    <div className="press-game-section">
      <img src={game.coverImage} alt={`${game.title} cover art`} />
      <div className="game-detail-meta">
        <StatusBadge status={game.status} />
      </div>
      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 26 }}>{game.title}</h3>
      <p>{game.description}</p>
      {game.keyFeatures?.length > 0 && (
        <ul className="game-detail-features">
          {game.keyFeatures.map((f) => <li key={f}>{f}</li>)}
        </ul>
      )}
      <div className="btn-row" style={{ marginTop: 20 }}>
        <SteamButton game={game} />
      </div>
    </div>
  );
}
