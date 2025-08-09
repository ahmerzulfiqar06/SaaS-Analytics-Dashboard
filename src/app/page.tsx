import Link from "next/link";

const cards = [
  {
    title: "Charts",
    desc: "Build and save charts from events (range, interval, groupBy, filters).",
    actions: [
      { label: "New chart", href: "/charts/new", primary: true },
      { label: "All charts", href: "/charts" },
    ],
  },
  {
    title: "Dashboards",
    desc: "Combine charts on a dashboard and reorder with drag-and-drop.",
    actions: [
      { label: "New dashboard", href: "/dashboards/new", primary: true },
      { label: "All dashboards", href: "/dashboards" },
    ],
  },
  {
    title: "Segments",
    desc: "Rule builder with live preview. Save audiences for targeting.",
    actions: [
      { label: "Open segments", href: "/segments", primary: true },
    ],
  },
  {
    title: "Reports",
    desc: "Schedule dashboard PDFs via email or send now.",
    actions: [
      { label: "Open reports", href: "/reports", primary: true },
    ],
  },
  {
    title: "Demo data",
    desc: "Insert realistic demo events over the last 7 days.",
    actions: [
      { label: "Generate events", href: "/debug/generate", primary: true },
    ],
  },
];

export default function Home() {
  return (
    <main className="px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">SaaS Analytics Dashboard</h1>
          <p className="text-sm text-gray-400">Modern, minimal analytics with charts, dashboards, segments and scheduled reports.</p>
        </div>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div key={c.title} className="rounded-xl border border-gray-800/60 bg-black/20 p-5 hover:border-gray-700 transition-colors">
              <div className="text-lg font-medium mb-1">{c.title}</div>
              <div className="text-sm text-gray-400 mb-4">{c.desc}</div>
              <div className="flex flex-wrap gap-2">
                {c.actions.map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className={"px-3 py-2 rounded-md text-sm border " + (a.primary ? "bg-indigo-600 text-white border-transparent hover:bg-indigo-500" : "border-gray-700 hover:border-gray-500")}
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
