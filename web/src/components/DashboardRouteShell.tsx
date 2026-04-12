"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { DashboardDrilldownShell } from "./DashboardDrilldownShell";
import { getElectionBySlug } from "../lib/dashboard";

export function DashboardRouteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const segments = useSelectedLayoutSegments();

  const isDashboardRoot = segments.length === 0;
  const isSeoulRoot = segments.length === 1 && segments[0] === "seoul";
  const isSeoulDistrict =
    segments.length === 2 &&
    segments[0] === "seoul" &&
    !getElectionBySlug(segments[1]);

  const content = (() => {
    if (isDashboardRoot) {
      return <DashboardDrilldownShell />;
    }

    if (isSeoulRoot) {
      return <DashboardDrilldownShell regionSlug="seoul" />;
    }

    if (isSeoulDistrict) {
      return (
        <DashboardDrilldownShell
          regionSlug="seoul"
          districtSlug={segments[1]}
        />
      );
    }

    return children;
  })();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">{content}</div>
    </div>
  );
}
