import siteConfig from "../siteConfig";
import useDocumentHead from "../hooks/useDocumentHead";
import useJsonLd from "../hooks/useJsonLd";

/**
 * Studio / About — static, no 3D, quiet by comparison (DESIGN.md).
 * Founder-note copy drafted in Boyd's established voice per SPEC.md §16
 * item 5 — flag for a quick read-through before launch.
 */
export default function Studio() {
  useDocumentHead({
    title: `Studio — ${siteConfig.businessName}`,
    description: "Who RubyxQube Games is, and how the studio connects to RubyxQube LLC.",
    url: `${siteConfig.domain}/studio`,
  });

  useJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.businessName,
    url: siteConfig.domain,
    logo: `${siteConfig.domain}/brand/rubyxqube_cube_600.png`,
    parentOrganization: { "@type": "Organization", name: "RubyxQube LLC", url: siteConfig.parentSite },
  });

  return (
    <section className="section studio-page">
      <span className="eyebrow">Studio</span>
      <h1>About RubyxQube Games</h1>

      <p>
        RubyxQube Games is the game studio side of RubyxQube LLC — the same company behind{" "}
        <a href={siteConfig.parentSite} target="_blank" rel="noopener noreferrer" className="parent-link">
          rubyxqube.com
        </a>, a web design and AI agency based in the Treasure Valley. Two different crafts, one
        studio: build things people actually want to use, and don't cut corners doing it.
      </p>

      <p>
        We tell familiar stories from an unfamiliar angle. Huff & Puff, our first release, asks
        what the fairy tale looks like from inside the wolf's night — three pigs building
        everything they can before dark, one wolf training for the moment it all comes down. It's
        chaotic on purpose. Good party games usually are.
      </p>

      <p>
        RubyxQube Games is small by design — one founder, one growing catalog, built the same way
        we build everything else: carefully, a little stubbornly, and always with room to add the
        next thing. Huff & Puff is Coming Soon to Early Access. It won't be the last game here.
      </p>

      <p>
        — Boyd Querubin, founder
      </p>
    </section>
  );
}
