import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "../hooks/useTheme";

export default function Layout() {
  const { theme, toggle } = useTheme();

  return (
    <div className="app-shell">
      <Navbar theme={theme} onToggle={toggle} />
      <main className="main-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
