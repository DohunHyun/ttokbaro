import { ElectionDashboard } from "../../../../components/ElectionDashboard";

export default function SeoulMayorDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <ElectionDashboard regionSlug="seoul" electionSlug="mayor" />
    </div>
  );
}
