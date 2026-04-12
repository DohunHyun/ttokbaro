import { ElectionDashboard } from "../../../../../components/ElectionDashboard";

export default async function SeoulMayorCandidatePage({
  params,
}: {
  params: Promise<{ candidateId: string }>;
}) {
  const { candidateId } = await params;
  const resolvedCandidateId = Number(candidateId);

  return (
    <div className="mx-auto max-w-7xl">
      <ElectionDashboard
        regionSlug="seoul"
        electionSlug="mayor"
        candidateId={Number.isFinite(resolvedCandidateId) ? resolvedCandidateId : null}
      />
    </div>
  );
}
