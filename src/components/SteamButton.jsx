import { Gamepad2 } from "lucide-react";

/**
 * SteamButton — label reads "Wishlist on Steam" whenever status === "coming-soon"
 * (every instance today), "Buy on Steam" once released, "View on Steam" otherwise.
 */
export default function SteamButton({ game, className = "" }) {
  if (!game?.steamUrl) return null;

  const label =
    game.status === "coming-soon" ? "Wishlist on Steam" :
    game.status === "released"    ? "Buy on Steam" :
    "View on Steam";

  return (
    <a
      href={game.steamUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`steam-btn ${className}`}
    >
      <Gamepad2 size={18} />
      {label}
    </a>
  );
}
