"use client";

import Link from "next/link";
import {
  DASHBOARD_ELECTIONS,
  getDashboardRegion,
  getSeoulDistrict,
} from "../lib/dashboard";

export function SeoulDistrictDashboardSkeleton({
  districtSlug,
}: {
  districtSlug: string;
}) {
  const region = getDashboardRegion("seoul");
  const district = getSeoulDistrict(districtSlug);

  if (!district) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        알 수 없는 자치구입니다.
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
          District
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">
          {district.label} 선거 대시보드
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {region?.label} {district.label} 기준 선거 종류를 붙일 수 있도록 만든
          뼈대 화면입니다.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/seoul"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700"
          >
            서울 지도으로 돌아가기
          </Link>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">선거 종류</h3>
          <p className="text-sm text-slate-500">
            현재는 구조만 준비되어 있고, 실제 데이터 연결은 이후 단계에서
            붙이면 됩니다.
          </p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {DASHBOARD_ELECTIONS.map((election) => (
            <div
              key={election.electionSlug}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-sm font-semibold text-slate-900">
                {election.fallbackLabel}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                /dashboard/seoul/{district.slug}/{election.electionSlug}
              </p>
              <p className="mt-3 text-xs text-slate-500">데이터 연결 예정</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
