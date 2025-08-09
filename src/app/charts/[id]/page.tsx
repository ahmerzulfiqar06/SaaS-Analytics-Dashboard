"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LineChart = dynamic(() => import("@/components/LineChart"), { ssr: false });

export default function ChartDetailPage({ params }: { params: { id: string } }) {
  const [chart, setChart] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/charts/${params.id}`);
        const c = await res.json();
        if (!res.ok) throw new Error(c?.error ?? "Chart not found");
        if (cancelled) return;
        setChart(c);
        const qRes = await fetch(`/api/query`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(c.query),
        });
        const q = await qRes.json();
        if (!qRes.ok) throw new Error(q?.error ?? "Query failed");
        if (cancelled) return;
        setData(q);
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!chart) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{chart.name}</h1>
      {data?.series && <LineChart series={data.series} />}
    </div>
  );
}


