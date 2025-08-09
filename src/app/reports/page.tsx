"use client";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [name, setName] = useState("");
  const [dashboardId, setDashboardId] = useState("");
  const [cron, setCron] = useState("0 9 * * 1");
  const [recipients, setRecipients] = useState("");
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const ds = await fetch('/api/dashboards?workspaceId=demo').then(r => r.json());
      setDashboards(ds);
      const rs = await fetch('/api/reports?workspaceId=demo').then(r => r.json()).catch(() => []);
      setReports(Array.isArray(rs) ? rs : []);
    })();
  }, []);

  async function create() {
    setLoading(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ workspaceId: 'demo', name, dashboardId, cron, recipients: recipients.split(/[,\s]+/).filter(Boolean) })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Create failed');
      setReports((r) => [json, ...r]);
      setName(""); setDashboardId(""); setRecipients("");
    } finally { setLoading(false); }
  }

  async function sendNow(id: string) {
    await fetch('/api/reports/send', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reportId: id })});
    alert('Triggered send');
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="flex flex-wrap gap-2 items-center">
        <input className="bg-transparent border border-gray-700 rounded px-2 py-1" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <select className="bg-transparent border border-gray-700 rounded px-2 py-1" value={dashboardId} onChange={(e)=>setDashboardId(e.target.value)}>
          <option value="">Select dashboard</option>
          {dashboards.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <input className="bg-transparent border border-gray-700 rounded px-2 py-1" placeholder="Cron" value={cron} onChange={(e)=>setCron(e.target.value)} />
        <input className="bg-transparent border border-gray-700 rounded px-2 py-1" placeholder="Recipients (comma/space)" value={recipients} onChange={(e)=>setRecipients(e.target.value)} />
        <button className="px-3 py-2 rounded bg-indigo-600 text-white" onClick={create} disabled={loading || !name || !dashboardId}>Create</button>
      </div>

      <ul className="space-y-3">
        {reports.map((r) => (
          <li key={r.id} className="p-4 rounded border border-gray-700 flex items-center justify-between">
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-gray-400">cron: {r.cron}</div>
            </div>
            <button className="px-3 py-2 rounded border border-gray-700" onClick={() => sendNow(r.id)}>Send now</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


