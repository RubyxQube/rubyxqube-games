export default function GameOverScreen({ score, onPlayAgain }) {
  return (
    <div className="minigame-overlay">
      <h3>Time's Up</h3>
      <p className="score-final">{score}</p>
      <p>houses blown down</p>
      <button type="button" className="btn btn-primary" onClick={onPlayAgain}>Play Again</button>
    </div>
  );
}
