import { DashboardRouteShell } from "../../components/DashboardRouteShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardRouteShell>{children}</DashboardRouteShell>;
}
