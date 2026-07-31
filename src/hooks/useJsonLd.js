import { useEffect } from "react";

// Injects/replaces a single <script type="application/ld+json"> in <head>
// for the current page. Same lightweight, no-new-dependency approach as
// useDocumentHead.js — covers §15's JSON-LD requirement (Organization on
// Home/Studio, VideoGame on each GameDetail).
export default function useJsonLd(schema) {
  useEffect(() => {
    if (!schema) return;
    let el = document.getElementById("page-json-ld");
    if (!el) {
      el = document.createElement("script");
      el.id = "page-json-ld";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    return () => { el?.remove(); };
  }, [schema]);
}
