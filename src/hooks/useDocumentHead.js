import { useEffect } from "react";

// Lightweight per-page <head> manager — no react-helmet-async in this
// project's deps (package.json intentionally stays close to §12's list),
// so this small imperative helper covers §15's "unique title/meta/OG/
// canonical per page" requirement without adding a new dependency.
function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * useDocumentHead — sets document.title, meta description, OG tags, and
 * canonical link for the current page. Call once per page component.
 */
export default function useDocumentHead({ title, description, image, url, canonical }) {
  useEffect(() => {
    if (title) document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    if (image) upsertMeta("property", "og:image", image);
    if (url) upsertMeta("property", "og:url", url);
    upsertLink("canonical", canonical || url);
  }, [title, description, image, url, canonical]);
}
