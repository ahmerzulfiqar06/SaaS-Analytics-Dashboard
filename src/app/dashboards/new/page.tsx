"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDashboardPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function create() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/dashboards", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ workspaceId: "demo", name }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to create");
      router.push(`/dashboards/${json.id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">New Dashboard</h1>
      <div className="flex gap-2">
        <input className="bg-transparent border border-gray-700 rounded px-2 py-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <button className="px-3 py-2 rounded bg-indigo-600 text-white disabled:opacity-50" onClick={create} disabled={!name || loading}>{loading ? "Creating…" : "Create"}</button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}


