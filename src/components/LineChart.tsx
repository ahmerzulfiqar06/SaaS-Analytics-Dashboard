"use client";
import { LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

type Props = { series: { t: string; value: number; group?: string | null }[] };

export default function LineChart({ series }: Props) {
  const data = series.map((s) => ({ t: new Date(s.t).toLocaleDateString(), value: s.value }));
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#4f46e5" dot={false} strokeWidth={2} />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}


