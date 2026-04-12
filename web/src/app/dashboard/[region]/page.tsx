import { ElectionDashboard } from "../../../components/ElectionDashboard";

export default async function RegionDashboardPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;

  return (
    <div className="mx-auto max-w-7xl">
      <ElectionDashboard regionSlug={region} />
    </div>
  );
}
