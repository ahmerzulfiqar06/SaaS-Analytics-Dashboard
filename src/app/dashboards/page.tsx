import Link from "next/link";

async function getDashboards() {
  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/dashboards?workspaceId=demo`, { cache: 'no-store' });
  return res.json();
}

export default async function DashboardsPage() {
  const dashboards = await getDashboards();
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboards</h1>
      <div className="text-sm text-gray-400">
        <Link href="/dashboards/new" className="underline">New dashboard</Link>
      </div>
      <ul className="space-y-3">
        {Array.isArray(dashboards) && dashboards.length > 0 ? (
          dashboards.map((d: any) => (
            <li key={d.id}>
              <Link href={`/dashboards/${d.id}`} className="block p-4 rounded border border-gray-700 hover:border-gray-500">
                <div className="font-medium">{d.name}</div>
                <div className="text-xs text-gray-400">items: {d.items?.length ?? 0}</div>
              </Link>
            </li>
          ))
        ) : (
          <li className="text-gray-400">No dashboards yet.</li>
        )}
      </ul>
    </div>
  );
}


