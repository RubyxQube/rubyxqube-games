/**
 * InteractionPrompt — fixed screen-space DOM overlay rather than a
 * projected/billboarded 3D-anchored prompt. SPEC.md §6 offers both as
 * options; this picks the simpler one since there's only one interactive
 * cabinet in v1. Revisit with projected positioning if a future cabinet
 * needs a prompt anchored to its own location instead of a fixed spot.
 */
export default function InteractionPrompt({ visible, isTouchDevice, onActivate }) {
  if (!visible) return null;

  if (isTouchDevice) {
    return (
      <button type="button" className="lobby-mobile-prompt" onClick={onActivate}>
        Tap to Play
      </button>
    );
  }

  return (
    <div className="lobby-prompt" onClick={onActivate} role="button" tabIndex={0}>
      Press E to Play
    </div>
  );
}
