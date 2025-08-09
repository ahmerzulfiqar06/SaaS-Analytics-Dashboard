"use client";
import { useState } from "react";
import { QuerySchema } from "@/lib/query";
import { z } from "zod";
import dynamic from "next/dynamic";

const LineChart = dynamic(() => import("@/components/LineChart"), { ssr: false });

export default function NewChartPage() {
  const [query, setQuery] = useState<z.infer<typeof QuerySchema>>({
    workspaceId: "demo",
    metric: "events.count",
    range: { from: new Date(Date.now() - 7 * 86400000), to: new Date() },
    interval: "day",
  });
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  async function run() {
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(query),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "Failed to run query");
        return;
      }
      setData(json);
    } catch (e: any) {
      setError(e.message ?? "Network error");
    }
  }

  async function save() {
    if (!data?.series) return;
    const name = prompt("Name this chart", "Events last 7 days");
    if (!name) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/charts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          workspaceId: query.workspaceId,
          name,
          query,
          viz: "line",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(`Save failed: ${json?.error ?? "unknown"}`);
        return;
      }
      alert("Saved! Open /charts to see it in the list.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Chart Builder</h1>
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded bg-black text-white" onClick={run}>Run</button>
        {data?.series?.length > 0 && (
          <button
            className="px-3 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
            onClick={save}
            disabled={isSaving}
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {data?.series && Array.isArray(data.series) && <LineChart series={data.series} />}
    </div>
  );
}


