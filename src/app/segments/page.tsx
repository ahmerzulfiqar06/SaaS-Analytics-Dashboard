"use client";
import { useEffect, useState } from "react";

type Rule = { field: string; op: string; value: any };

export default function SegmentsPage() {
  const [name, setName] = useState("");
  const [rules, setRules] = useState<Rule[]>([{ field: "plan", op: "=", value: "pro" }]);
  const [preview, setPreview] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateRule(i: number, patch: Partial<Rule>) {
    setRules((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function runPreview() {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/segments/preview', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ workspaceId: 'demo', rules })});
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Preview failed');
      setPreview(json.rows || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function save() {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/segments', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ workspaceId: 'demo', name, rules })});
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Save failed');
      alert('Saved');
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Segments</h1>
      <div className="flex items-center gap-2">
        <input className="bg-transparent border border-gray-700 rounded px-2 py-1" placeholder="Segment name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="px-3 py-2 rounded bg-indigo-600 text-white" onClick={save} disabled={!name || loading}>Save</button>
      </div>
      <div className="space-y-2">
        {rules.map((r, i) => (
          <div key={i} className="flex gap-2 items-center">
            <select className="bg-transparent border border-gray-700 rounded px-2 py-1" value={r.field} onChange={(e) => updateRule(i, { field: e.target.value })}>
              <option value="plan">Account plan</option>
              <option value="feature_x_used_last7">feature_x_used last 7 days &gt;=</option>
            </select>
            <select className="bg-transparent border border-gray-700 rounded px-2 py-1" value={r.op} onChange={(e) => updateRule(i, { op: e.target.value })}>
              <option value="=">=</option>
            </select>
            <input className="bg-transparent border border-gray-700 rounded px-2 py-1" value={r.value} onChange={(e) => updateRule(i, { value: e.target.value })} />
          </div>
        ))}
        <button className="px-3 py-2 rounded border border-gray-700" onClick={() => setRules([...rules, { field: 'plan', op: '=', value: 'pro' }])}>+ Add rule</button>
      </div>
      <div>
        <button className="px-3 py-2 rounded bg-black text-white" onClick={runPreview} disabled={loading}>Preview</button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="overflow-auto border border-gray-800 rounded">
        <table className="min-w-[600px] text-sm">
          <thead><tr><th className="text-left p-2">User</th><th className="text-left p-2">Account</th><th className="text-left p-2">Plan</th></tr></thead>
          <tbody>
            {preview.map((r) => (
              <tr key={r.id} className="border-t border-gray-800"><td className="p-2">{r.email || r.name || r.id}</td><td className="p-2">{r.account_name}</td><td className="p-2">{r.plan}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


