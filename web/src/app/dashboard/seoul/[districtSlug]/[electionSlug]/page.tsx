import Link from "next/link";
import {
  getElectionBySlug,
  getSeoulDistrict,
} from "../../../../../lib/dashboard";

export default async function SeoulDistrictElectionPage({
  params,
}: {
  params: Promise<{ districtSlug: string; electionSlug: string }>;
}) {
  const { districtSlug, electionSlug } = await params;
  const district = getSeoulDistrict(districtSlug);
  const election = getElectionBySlug(electionSlug);

  if (!district || !election) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        알 수 없는 자치구 또는 선거 종류입니다.
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/dashboard/seoul/${district.slug}`}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
          >
            ← {district.label} 지도로 돌아가기
          </Link>
          <Link
            href="/dashboard/seoul"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
          >
            서울 상세 지도로
          </Link>
        </div>

        <p className="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
          District Election
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {district.label} · {election.fallbackLabel}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          서울 drill-down 구조에서 자치구별 선거 상세 URL을 받을 수 있도록
          만들어 둔 1차 페이지입니다. 실제 데이터 연결은 이후 단계에서 붙이면
          됩니다.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">현재 경로</p>
        <p className="mt-2 text-lg font-semibold text-slate-900">
          /dashboard/seoul/{district.slug}/{election.electionSlug}
        </p>
        <p className="mt-3 text-sm text-slate-600">
          이 경로는 서울 자치구 지도에서 구를 선택한 뒤, 우측 보드의 선거
          종류를 눌렀을 때 진입하는 3레벨 URL입니다.
        </p>
      </section>
    </section>
  );
}
