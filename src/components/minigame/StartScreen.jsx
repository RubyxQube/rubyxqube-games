export default function StartScreen({ isTouch, onStart }) {
  return (
    <div className="minigame-overlay">
      <h3>Blow the House Down</h3>
      <p>
        {isTouch
          ? "Hold the button below to charge your breath, then let go to blow. Straw falls in one hit — sticks and bricks take more."
          : "Hold spacebar (or tap the button below) to charge your breath, then release to blow. Straw falls in one hit — sticks and bricks take more."}
      </p>
      <p>60 seconds on the clock. Score a point for every house you blow down.</p>
      <button type="button" className="btn btn-primary" onClick={onStart}>Start</button>
    </div>
  );
}
