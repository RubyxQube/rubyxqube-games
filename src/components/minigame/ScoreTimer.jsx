function formatTime(t) {
  const total = Math.max(0, Math.ceil(t));
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** ScoreTimer (DOM) — top bar, Space Mono, mm:ss + SCORE:n. */
export default function ScoreTimer({ timeLeft, score }) {
  return (
    <>
      <span className="timer">{formatTime(timeLeft)}</span>
      <span className="score">SCORE: {score}</span>
    </>
  );
}
