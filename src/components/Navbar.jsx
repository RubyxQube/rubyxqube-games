import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import gamesWordmarkLight from "../assets/brand/RubyxQube_horizontal_light.png";

const LINKS = [
  { to: "/games",  label: "Games" },
  { to: "/studio", label: "Studio" },
  { to: "/press",  label: "Press" },
  { to: "/contact", label: "Contact" },
];

// Navbar stays visually dark regardless of site theme — the "RubyxQube
// Games" wordmark PNG is the light-on-dark variant, matching the
// workspace's "navbar/footer always dark" rule.
export default function Navbar({ theme, onToggle }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" aria-label="RubyxQube Games home">
          <img src={gamesWordmarkLight} alt="RubyxQube Games" />
        </Link>

        <nav className="navbar-links" aria-label="Primary">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? "active" : ""}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-right">
          <ThemeToggle theme={theme} onToggle={onToggle} />
          <button
            type="button"
            className="navbar-hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu" role="dialog" aria-label="Navigation menu">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
