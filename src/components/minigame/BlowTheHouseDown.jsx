import { useState, useCallback, useRef, useEffect } from "react";
import MinigameCanvas from "./MinigameCanvas";
import BreathMeter from "./BreathMeter";
import ScoreTimer from "./ScoreTimer";
import StartScreen from "./StartScreen";
import GameOverScreen from "./GameOverScreen";
import useBreathCharge from "./useBreathCharge";
import useGameInput from "./useGameInput";
import useReducedMotion from "../../hooks/useReducedMotion";

const HITS_TO_COLLAPSE = { straw: 1, sticks: 2, bricks: 3 };
const HOUSE_CYCLE = ["straw", "sticks", "bricks"];
const ROUND_SECONDS = 60;
const COLLAPSE_PAUSE_MS = 500;

/**
 * BlowTheHouseDown — state machine: ready -> playing -> gameover.
 * Per-house sub-state (idle -> charging -> released -> collapsing ->
 * cleared) is derived from `stage`/`collapsing` rather than tracked as its
 * own enum — same information, fewer states to keep in sync.
 */
export default function BlowTheHouseDown() {
  const reducedMotion = useReducedMotion();
  const [gameState, setGameState] = useState("ready"); // ready | playing | gameover
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [houseIndex, setHouseIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [shakeToken, setShakeToken] = useState(0);
  const [collapsing, setCollapsing] = useState(false);
  const collapseTimeoutRef = useRef(null);

  const houseType = HOUSE_CYCLE[houseIndex % HOUSE_CYCLE.length];
  const maxStage = HITS_TO_COLLAPSE[houseType];

  const reset = useCallback(() => {
    if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current);
    setScore(0);
    setHouseIndex(0);
    setStage(0);
    setCollapsing(false);
    setTimeLeft(ROUND_SECONDS);
    setGameState("playing");
  }, []);

  const handleRelease = useCallback(
    (isHit) => {
      if (gameState !== "playing" || collapsing || !isHit) return;
      setStage((s) => {
        const next = s + 1;
        if (next >= maxStage) {
          setCollapsing(true);
          setScore((sc) => sc + 1);
          collapseTimeoutRef.current = setTimeout(() => {
            setHouseIndex((h) => h + 1);
            setStage(0);
            setCollapsing(false);
          }, COLLAPSE_PAUSE_MS);
          return maxStage;
        }
        setShakeToken((t) => t + 1);
        return next;
      });
    },
    [gameState, collapsing, maxStage]
  );

  const { charge, start, release } = useBreathCharge({ onRelease: handleRelease });
  const { isTouch, buttonHandlers } = useGameInput({
    enabled: gameState === "playing" && !collapsing,
    onChargeStart: start,
    onChargeEnd: release,
  });

  // 60s countdown, ticking only while playing.
  useEffect(() => {
    if (gameState !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        const next = +(t - 0.1).toFixed(1);
        if (next <= 0) {
          clearInterval(id);
          setGameState("gameover");
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [gameState]);

  useEffect(() => () => { if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current); }, []);

  return (
    <div className="minigame-section">
      <div className="minigame-wrap">
        <MinigameCanvas
          houseType={houseType}
          stage={stage}
          houseKey={houseIndex}
          shakeToken={shakeToken}
          reducedMotion={reducedMotion}
        />

        {gameState === "playing" && (
          <>
            <div className="minigame-hud-top">
              <ScoreTimer timeLeft={timeLeft} score={score} />
            </div>
            <BreathMeter charge={charge} />
            <button type="button" className="charge-btn" {...buttonHandlers}>
              {isTouch ? "Hold to Charge" : "Hold SPACE to Charge"}
            </button>
          </>
        )}

        {gameState === "ready" && <StartScreen isTouch={isTouch} onStart={reset} />}
        {gameState === "gameover" && <GameOverScreen score={score} onPlayAgain={reset} />}
      </div>
    </div>
  );
}
