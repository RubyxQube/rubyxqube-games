import { Link } from "react-router-dom";
import LobbyScene from "../components/lobby/LobbyScene";
import LobbyReducedMotion from "../components/lobby/LobbyReducedMotion";
import LobbyErrorBoundary from "../components/lobby/LobbyErrorBoundary";
import GameCard from "../components/GameCard";
import SteamButton from "../components/SteamButton";
import useReducedMotion from "../hooks/useReducedMotion";
import useSettleIn from "../hooks/useSettleIn";
import useDocumentHead from "../hooks/useDocumentHead";
import useJsonLd from "../hooks/useJsonLd";
import siteConfig from "../siteConfig";
import games from "../data/games";

export default function Home() {
  const reducedMotion = useReducedMotion();
  const blurb = useSettleIn();
  const catalog = useSettleIn();
  const featuredGame = games[0];

  useDocumentHead({
    title: `${siteConfig.businessName} — ${siteConfig.tagline}`,
    description: "RubyxQube Games is an indie studio building Huff & Puff and a growing catalog of playful, mischievous multiplayer party games.",
    url: siteConfig.domain,
    image: `${siteConfig.domain}/brand/RubyxQube_horizontal_light.png`,
  });

  useJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.businessName,
    url: siteConfig.domain,
    logo: `${siteConfig.domain}/brand/rubyxqube_cube_600.png`,
    parentOrganization: {
      "@type": "Organization",
      name: "RubyxQube LLC",
      url: siteConfig.parentSite,
    },
    sameAs: [siteConfig.parentSite],
  });

  return (
    <>
      <LobbyErrorBoundary>
        {reducedMotion ? <LobbyReducedMotion /> : <LobbyScene />}
      </LobbyErrorBoundary>

      <section className={`studio-blurb settle-in${blurb.inView ? " in-view" : ""}`} ref={blurb.ref}>
        <span className="eyebrow">The Studio</span>
        <h2>Fairy tales, from the predator's side.</h2>
        <p>
          RubyxQube Games is a small indie studio telling old stories from a new angle — chaotic,
          playful, a little mischievous, and built to be played with friends. We make the kind of
          games that turn a couch or a Steam lobby into a shouting match.
        </p>
        <p>
          Huff & Puff is our first release: three pigs build, one wolf hunts, and the night always
          ends in a chase. It's Coming Soon to Early Access — walk into the arcade above and give
          the demo a try, or read more below.
        </p>
      </section>

      <section
        className={`section catalog-strip settle-in${catalog.inView ? " in-view" : ""}`}
        ref={catalog.ref}
      >
        <div className="catalog-strip-head">
          <h2 className="section-heading" style={{ marginBottom: 0 }}>Our Games</h2>
          <Link to="/games" className="view-all">View all games →</Link>
        </div>
        <div className="grid cols-3">
          {games.map((g) => <GameCard key={g.slug} game={g} />)}
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-band-inner">
          <h2>Wishlist Huff & Puff today</h2>
          <p>Coming Soon to Early Access — wishlist now so you don't miss launch day.</p>
          <div className="btn-row">
            <SteamButton game={featuredGame} />
            <Link to="/games" className="btn btn-ghost">Browse the catalog</Link>
          </div>
        </div>
      </section>
    </>
  );
}
