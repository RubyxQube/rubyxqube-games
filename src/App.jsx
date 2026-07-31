import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Games from "./pages/Games";
import GameDetail from "./pages/GameDetail";
import Studio from "./pages/Studio";
import PressKit from "./pages/PressKit";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"             element={<Home />} />
          <Route path="/games"        element={<Games />} />
          <Route path="/games/:slug"  element={<GameDetail />} />
          <Route path="/studio"       element={<Studio />} />
          <Route path="/press"        element={<PressKit />} />
          <Route path="/contact"      element={<Contact />} />
        </Route>
      </Routes>
    </>
  );
}
