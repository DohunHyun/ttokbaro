import { ElectionDashboard } from "../../../../../components/ElectionDashboard";

export default async function RegionElectionCandidateDashboardPage({
  params,
}: {
  params: Promise<{ region: string; electionSlug: string; candidateId: string }>;
}) {
  const { region, electionSlug, candidateId } = await params;
  const resolvedCandidateId = Number(candidateId);

  return (
    <div className="mx-auto max-w-7xl">
      <ElectionDashboard
        regionSlug={region}
        electionSlug={electionSlug}
        candidateId={Number.isFinite(resolvedCandidateId) ? resolvedCandidateId : null}
      />
    </div>
  );
}
