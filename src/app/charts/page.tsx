import Link from "next/link";

async function getCharts() {
  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/charts?workspaceId=demo`, { cache: 'no-store' });
  return res.json();
}

export default async function ChartsPage() {
  const charts = await getCharts();
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Charts</h1>
      <div className="text-sm text-gray-400">
        <Link href="/charts/new" className="underline">New chart</Link>
      </div>
      <ul className="space-y-3">
        {Array.isArray(charts) && charts.length > 0 ? (
          charts.map((c: any) => (
            <li key={c.id} className="p-4 rounded border border-gray-700">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-400">viz: {c.viz}</div>
            </li>
          ))
        ) : (
          <li className="text-gray-400">No charts yet. Create one at /charts/new</li>
        )}
      </ul>
    </div>
  );
}


