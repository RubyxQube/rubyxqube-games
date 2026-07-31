const LABELS = {
  released: "Released",
  "coming-soon": "Coming Soon to Early Access",
  "in-development": "In Development",
  announced: "Announced",
};

const CLASSES = {
  released: "badge-released",
  "coming-soon": "badge-coming-soon",
  "in-development": "badge-in-development",
  announced: "badge-announced",
};

/**
 * StatusBadge — supports released / in-development / announced / coming-soon.
 * coming-soon (Huff & Puff's current status) is styled distinctly — Strawgold,
 * anticipatory — not the "shipped" treatment released would get.
 */
export default function StatusBadge({ status }) {
  const label = LABELS[status] || status;
  const cls = CLASSES[status] || "badge-announced";
  return <span className={`badge ${cls}`}>{label}</span>;
}
