"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LineChart = dynamic(() => import("@/components/LineChart"), { ssr: false });
export default function DashboardPage({ params }: { params: { id: string } }) {
  const [dashboard, setDashboard] = useState<any>(null);
  const [charts, setCharts] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    (async () => {
      const d = await fetch(`/api/dashboards?id=${params.id}`).then(r => r.json());
      setDashboard(d);
      const c = await fetch(`/api/charts?workspaceId=demo`).then(r => r.json());
      setCharts(c);
    })();
  }, [params.id]);

  async function addChart(chartId: string) {
    setAdding(true);
    try {
      const res = await fetch(`/api/dashboards/${params.id}/charts`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ chartId })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(`Add chart failed: ${j?.error ?? res.status}`);
      } else {
        const updated = await fetch(`/api/dashboards?id=${params.id}`).then(r => r.json());
        setDashboard(updated);
      }
    } finally {
      setAdding(false);
    }
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
  const [chart, setChart] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const c = await fetch(`/api/charts/${id}`).then(r => r.json());
      setChart(c);
      if (c?.query) {
        const q = await fetch('/api/query', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(c.query) }).then(r => r.json());
        setData(q);
      }
    })();
  }, [id]);
  if (!data?.series) return <div className="w-[400px] h-[240px] border border-gray-800 rounded" />;
  return (
    <div className="w-[400px] h-[240px] border border-gray-800 rounded p-2">
      <LineChart series={data.series} />
    </div>
  );
}


