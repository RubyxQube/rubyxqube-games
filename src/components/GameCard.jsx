import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

/**
 * GameCard — cover image, title, tagline, status badge, click-through to
 * /games/:slug. Used by Games.jsx and Home.jsx's catalog strip.
 */
export default function GameCard({ game }) {
  return (
    <Link to={`/games/${game.slug}`} className="card game-card">
      <img
        src={game.coverImage}
        alt={`${game.title} cover art`}
        className="game-card-cover"
        loading="lazy"
      />
      <div className="game-card-body">
        <div className="game-card-badge-row">
          <StatusBadge status={game.status} />
        </div>
        <h3>{game.title}</h3>
        <p className="game-card-tagline">{game.tagline}</p>
      </div>
    </Link>
  );
}
