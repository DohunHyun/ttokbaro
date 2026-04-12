"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import seoulDistrictMap from "../data/seoul-district-map.json";
import {
  DASHBOARD_ELECTIONS,
  getDashboardRegion,
  getSeoulDistrict,
  SEOUL_DISTRICTS,
} from "../lib/dashboard";

const DISTRICT_LABEL_OVERRIDES: Record<
  string,
  { x: number; y: number }
> = {
  종로구: { x: 374, y: 188 },
  중구: { x: 395, y: 228 },
  용산구: { x: 383, y: 275 },
  성동구: { x: 468, y: 248 },
  광진구: { x: 548, y: 245 },
  동대문구: { x: 500, y: 203 },
  중랑구: { x: 584, y: 171 },
  성북구: { x: 446, y: 157 },
  강북구: { x: 478, y: 116 },
  도봉구: { x: 549, y: 82 },
  노원구: { x: 618, y: 117 },
  은평구: { x: 294, y: 173 },
  서대문구: { x: 312, y: 247 },
  마포구: { x: 282, y: 339 },
  양천구: { x: 195, y: 455 },
  강서구: { x: 107, y: 371 },
  구로구: { x: 152, y: 505 },
  금천구: { x: 216, y: 562 },
  영등포구: { x: 264, y: 438 },
  동작구: { x: 337, y: 431 },
  관악구: { x: 292, y: 547 },
  서초구: { x: 425, y: 499 },
  강남구: { x: 569, y: 505 },
  송파구: { x: 668, y: 448 },
  강동구: { x: 731, y: 374 },
};

const DISTRICT_GROUP_LABELS: Record<string, string> = {
  superintendent: "교육감",
  mayor: "서울특별시장",
  "district-head": "구청장",
  "city-council-district": "지역구 시의원",
  "city-council-pr": "비례대표 시의원",
  "district-council-district": "지역구 구의원",
  "district-council-pr": "비례대표 구의원",
};

function getElectionHref(districtSlug: string, electionSlug: string) {
  if (electionSlug === "mayor" || electionSlug === "superintendent") {
    return `/dashboard/seoul/${electionSlug}`;
  }

  return `/dashboard/seoul/${districtSlug}/${electionSlug}`;
}

export function SeoulDistrictMap({
  initialDistrictSlug,
}: {
  initialDistrictSlug?: string;
}) {
  const region = getDashboardRegion("seoul");
  const initialDistrict = initialDistrictSlug
    ? getSeoulDistrict(initialDistrictSlug)
    : null;

  const [hoveredDistrictSlug, setHoveredDistrictSlug] = useState<string | null>(
    null
  );
  const [selectedDistrictSlug, setSelectedDistrictSlug] = useState<string | null>(
    initialDistrict?.slug ?? null
  );

  const districtMetadata = useMemo(
    () =>
      Object.fromEntries(
        SEOUL_DISTRICTS.map((district) => [
          district.label,
          {
            ...district,
            shortLabel: district.label.replace("구", ""),
          },
        ])
      ),
    []
  );

  const districts = useMemo(
    () =>
      seoulDistrictMap.paths
        .map((path) => {
          const metadata = districtMetadata[path.id];

          if (!metadata) {
            return null;
          }

          return {
            ...metadata,
            d: path.d,
            center: DISTRICT_LABEL_OVERRIDES[path.id] ?? path.center,
          };
        })
        .filter((district) => district !== null),
    [districtMetadata]
  );

  const hoveredDistrict = hoveredDistrictSlug
    ? getSeoulDistrict(hoveredDistrictSlug)
    : null;
  const selectedDistrict = selectedDistrictSlug
    ? getSeoulDistrict(selectedDistrictSlug)
    : null;
  const panelDistrict = hoveredDistrict ?? selectedDistrict;

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
          Drill-down
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">
          {region?.headline ?? "서울 선거 대시보드"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          전국 지도에서 서울로 들어온 뒤, 자치구 단위로 다시 선택할 수 있는
          2레벨 상세 지도입니다.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#f8fbff_0%,#f1f5f9_100%)] p-4 shadow-sm">
            <Link
              href="/"
              className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
            >
              ← 전국 지도로
            </Link>

            <div className="mx-auto min-h-[720px] w-full pt-12">
              <svg
                viewBox={seoulDistrictMap.viewBox}
                className="h-full min-h-[720px] w-full"
                role="img"
                aria-label="서울 자치구 지도"
                shapeRendering="geometricPrecision"
                textRendering="geometricPrecision"
                preserveAspectRatio="xMidYMid meet"
              >
                <title>서울 자치구 지도</title>
                <rect x="0" y="0" width="800" height="666" fill="transparent" />

                <g transform="translate(-18 -10) scale(1.05)">
                  {districts.map((district) => {
                    const isHovered = hoveredDistrictSlug === district.slug;
                    const isSelected = selectedDistrictSlug === district.slug;

                    return (
                      <g
                        key={district.slug}
                        onMouseEnter={() => setHoveredDistrictSlug(district.slug)}
                        onMouseLeave={() => setHoveredDistrictSlug(null)}
                        onClick={() => setSelectedDistrictSlug(district.slug)}
                        className="cursor-pointer"
                      >
                        <path
                          d={district.d}
                          fill={isSelected ? "#3b82f6" : isHovered ? "#bfdbfe" : "#e2e8f0"}
                          stroke={isSelected ? "#1d4ed8" : isHovered ? "#60a5fa" : "#94a3b8"}
                          strokeWidth={isSelected ? 2.4 : isHovered ? 2 : 1.5}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          className="transition-colors duration-150 ease-out"
                          style={{ cursor: "pointer" }}
                        />
                      </g>
                    );
                  })}

                  {districts.map((district) => {
                    const isHovered = hoveredDistrictSlug === district.slug;
                    const isSelected = selectedDistrictSlug === district.slug;

                    if (!isHovered && !isSelected) {
                      return null;
                    }

                    return (
                      <path
                        key={`${district.slug}-outline`}
                        d={district.d}
                        fill="none"
                        stroke={isSelected ? "#1d4ed8" : "#60a5fa"}
                        strokeWidth={isSelected ? 2.6 : 2.2}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        className="pointer-events-none"
                      />
                    );
                  })}

                  {districts.map((district) => {
                    const isHovered = hoveredDistrictSlug === district.slug;
                    const isSelected = selectedDistrictSlug === district.slug;

                    return (
                      <text
                        key={`${district.slug}-label`}
                        x={district.center.x}
                        y={district.center.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          fontSize: isHovered || isSelected ? "15px" : "12px",
                          fontWeight: isHovered || isSelected ? 800 : 700,
                          fill: "#111827",
                          paintOrder: "stroke",
                          stroke: "rgba(255,255,255,0.95)",
                          strokeWidth: isHovered || isSelected ? 3.1 : 2.7,
                          letterSpacing: "-0.02em",
                        }}
                        className="pointer-events-none select-none"
                      >
                        {district.shortLabel}
                      </text>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:h-[720px] lg:overflow-y-auto lg:pr-1">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">현재 포커스</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {panelDistrict?.label ?? "서울 전체"}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {panelDistrict
                ? `${panelDistrict.group} 기준으로 선거 종류를 선택할 수 있습니다. 지도에서 다른 자치구를 클릭하면 이 패널이 함께 바뀝니다.`
                : "지도의 자치구를 클릭하면 해당 구 기준으로 우측 보드가 갱신됩니다."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">선택 구역</p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-900">
                  {panelDistrict?.label ?? "서울 전체"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {panelDistrict
                    ? `${panelDistrict.group} 상세 지도`
                    : "자치구를 선택하면 구 단위 상세 문맥이 반영됩니다."}
                </p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                25개 자치구
              </span>
            </div>

            {panelDistrict ? (
              <div className="mt-4 space-y-3">
                {DASHBOARD_ELECTIONS.map((election) => (
                  <Link
                    key={election.electionSlug}
                    href={getElectionHref(panelDistrict.slug, election.electionSlug)}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-300 hover:bg-white"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {DISTRICT_GROUP_LABELS[election.electionSlug] ??
                          election.fallbackLabel}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {getElectionHref(panelDistrict.slug, election.electionSlug)}
                      </p>
                    </div>
                    <span className="text-sm text-slate-500">열기</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                지도에서 자치구를 선택하면 이곳에 해당 구 기준 선거 종류가
                표시됩니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
