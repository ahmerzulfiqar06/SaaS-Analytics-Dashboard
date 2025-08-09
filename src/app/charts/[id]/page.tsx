import dynamic from "next/dynamic";
import { QuerySchema } from "@/lib/query";

const LineChart = dynamic(() => import("@/components/LineChart"), { ssr: false });

async function getChart(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/charts/${id}`, { cache: 'no-store' });
  return res.json();
}

async function runQueryServer(input: any) {
  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/query`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });
  return res.json();
}

export default async function ChartDetailPage({ params }: { params: { id: string } }) {
  const chart = await getChart(params.id);
  if (!chart?.id) {
    return <div className="p-6">Not found</div>;
  }
  const query = chart.query;
  const data = await runQueryServer(query);
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{chart.name}</h1>
      {data?.series && <LineChart series={data.series} />}
    </div>
  );
}


