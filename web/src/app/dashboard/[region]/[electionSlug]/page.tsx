import { ElectionDashboard } from "../../../../components/ElectionDashboard";

export default async function RegionElectionDashboardPage({
  params,
}: {
  params: Promise<{ region: string; electionSlug: string }>;
}) {
  const { region, electionSlug } = await params;

  return (
    <div className="mx-auto max-w-7xl">
      <ElectionDashboard regionSlug={region} electionSlug={electionSlug} />
    </div>
  );
}
