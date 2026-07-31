import { Sun, Moon } from "lucide-react";

/**
 * ThemeToggle — small icon button, dark/light switch.
 * theme + onToggle are lifted to Layout.jsx (via useTheme) and passed down.
 */
export default function ThemeToggle({ theme, onToggle }) {
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  return (
    <button type="button" className="theme-toggle" onClick={onToggle} aria-label={label} title={label}>
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
