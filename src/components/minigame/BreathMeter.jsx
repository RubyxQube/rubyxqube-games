function lerpColor(a, b, t) {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const b2 = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${b2})`;
}

/**
 * BreathMeter (DOM) — semi-circular/conic dial, Strawgold -> Brickrust as
 * charge rises, Space Mono % overlay.
 */
export default function BreathMeter({ charge }) {
  const pct = Math.round(charge * 100);
  const color = lerpColor("#E3A857", "#8C4A3A", charge);

  return (
    <div className="breath-meter">
      <div
        className="breath-meter-dial"
        style={{ background: `conic-gradient(${color} ${pct}%, rgba(255,255,255,0.14) 0)` }}
      >
        <div className="breath-meter-dial-inner breath-pct">{pct}%</div>
      </div>
    </div>
  );
}
