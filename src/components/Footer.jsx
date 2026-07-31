import { Link } from "react-router-dom";
import siteConfig from "../siteConfig";
import studioWordmarkLight from "../assets/brand/RubyxQube_horizontal_light_studio.png";
import cube64 from "../assets/brand/cube-64.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={studioWordmarkLight} alt={siteConfig.studioName} />
          <p className="footer-tagline">{siteConfig.tagline}</p>
        </div>

        <div className="footer-col">
          <h4>Studio</h4>
          <nav className="footer-links">
            <Link to="/games">Games</Link>
            <Link to="/studio">Studio</Link>
            <Link to="/press">Press Kit</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <nav className="footer-links">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <a href={siteConfig.parentSite} target="_blank" rel="noopener noreferrer">{siteConfig.parentSite.replace("https://", "")}</a>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} RubyxQube LLC. All rights reserved.</span>
        <span className="footer-credit">
          <img src={cube64} alt="" aria-hidden="true" />
          {siteConfig.credit}
        </span>
      </div>
    </footer>
  );
}
