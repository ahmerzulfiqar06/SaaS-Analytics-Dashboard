"use client";
import { useState } from "react";

export default function GenerateEventsPage() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<string | null>(null);

  async function generate(n = 50) {
    setStatus("Generating...");
    setCount(0);
    for (let i = 0; i < n; i++) {
      const ts = new Date(Date.now() - Math.random() * 7 * 86400000).toISOString();
      await fetch("/api/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          workspaceId: "demo",
          name: Math.random() > 0.7 ? "feature_x_used" : "page_view",
          ts,
          props: { path: "/", source: "generator" },
        }),
      });
      setCount((c) => c + 1);
    }
    setStatus("Done");
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Generate Demo Events</h1>
      <p className="text-sm text-gray-400">Click to insert demo events into workspace "demo" over the last 7 days.</p>
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded bg-indigo-600 text-white" onClick={() => generate(50)}>Generate 50</button>
        <button className="px-3 py-2 rounded bg-indigo-600 text-white" onClick={() => generate(200)}>Generate 200</button>
      </div>
      <div className="text-sm text-gray-400">Inserted: {count} {status && `(${status})`}</div>
    </div>
  );
}


