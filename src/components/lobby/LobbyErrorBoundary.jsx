import { Component } from "react";
import { Link } from "react-router-dom";

// Some browsers/devices can't create a WebGL context at all (locked-down
// corporate policy, driver crash, GPU exhaustion). Canvas throws in that
// case, and there's no reduced-motion path that helps — LobbyReducedMotion
// still needs a Canvas. This is the true last-resort fallback: no 3D at all,
// just a way into the site's real content.
export default class LobbyErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Arcade lobby failed to render:", error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="lobby-wrap lobby-unavailable">
          <p className="lobby-unavailable-title">The arcade won't load in this browser.</p>
          <p>No 3D graphics support detected — here's the games catalog instead.</p>
          <Link to="/games" className="btn btn-primary">Browse the games</Link>
        </div>
      );
    }
    return this.props.children;
  }
}
