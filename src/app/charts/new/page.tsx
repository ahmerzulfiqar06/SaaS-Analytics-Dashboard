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

  async function run() {
    const res = await fetch("/api/query", { method: "POST", body: JSON.stringify(query) });
    setData(await res.json());
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Chart Builder</h1>
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded bg-black text-white" onClick={run}>Run</button>
      </div>
      {data && <LineChart series={data.series} />}
    </div>
  );
}


