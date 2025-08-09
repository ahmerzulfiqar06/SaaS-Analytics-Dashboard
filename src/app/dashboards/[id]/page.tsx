"use client";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useState } from "react";

const LineChart = dynamic(() => import("@/components/LineChart"), { ssr: false });

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function DashboardPage({ params }: { params: { id: string } }) {
  const { data: dashboard } = useSWR(`/api/dashboards?id=${params.id}`, fetcher);
  const { data: charts } = useSWR(`/api/charts?workspaceId=demo`, fetcher);
  const [adding, setAdding] = useState(false);

  async function addChart(chartId: string) {
    setAdding(true);
    await fetch(`/api/dashboards/${params.id}/charts`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ chartId })
    });
    setAdding(false);
    location.reload();
  }

  if (!dashboard) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{dashboard?.name ?? 'Dashboard'}</h1>
      <div className="flex flex-wrap gap-4">
        {dashboard?.items?.length ? dashboard.items.map((it: any) => (
          <DashboardChart key={it.id} id={it.chartId} />
        )) : <p className="text-gray-400">No charts yet.</p>}
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Add chart</h2>
        <div className="flex gap-2 flex-wrap">
          {Array.isArray(charts) && charts.map((c: any) => (
            <button key={c.id} onClick={() => addChart(c.id)} className="px-3 py-2 rounded border border-gray-700 hover:border-gray-500" disabled={adding}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardChart({ id }: { id: string }) {
  const { data: chart } = useSWR(`/api/charts/${id}`, fetcher);
  const { data } = useSWR(() => chart?.query ? ['/api/query', chart.query] : null, {
    fetcher: (_key: string, body: any) => fetch('/api/query', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json())
  } as any);
  if (!data?.series) return <div className="w-[400px] h-[240px] border border-gray-800 rounded" />;
  return (
    <div className="w-[400px] h-[240px] border border-gray-800 rounded p-2">
      <LineChart series={data.series} />
    </div>
  );
}


