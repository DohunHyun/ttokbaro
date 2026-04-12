"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DASHBOARD_ELECTIONS, DASHBOARD_REGIONS } from "../lib/dashboard";
import koreaSidoMap from "../data/korea-sido-map.json";
import { MapPanelHeader } from "./MapPanelHeader";

const KOREA_REGION_METADATA = {
  서울특별시: {
    slug: "seoul",
    label: "서울",
    shortLabel: "서울",
    center: { x: 258, y: 164 },
    labelCenter: { x: 264, y: 154 },
    smallRegion: true,
  },
  부산광역시: {
    slug: "busan",
    label: "부산",
    shortLabel: "부산",
    center: { x: 483, y: 478 },
    labelCenter: { x: 496, y: 488 },
    smallRegion: true,
  },
  대구광역시: {
    slug: "daegu",
    label: "대구",
    shortLabel: "대구",
    center: { x: 447, y: 413 },
    labelCenter: { x: 456, y: 410 },
    smallRegion: true,
  },
  인천광역시: {
    slug: "incheon",
    label: "인천",
    shortLabel: "인천",
    center: { x: 132, y: 177 },
    labelCenter: { x: 132, y: 164 },
    smallRegion: true,
  },
  광주광역시: {
    slug: "gwangju",
    label: "광주",
    shortLabel: "광주",
    center: { x: 238, y: 489 },
    labelCenter: { x: 228, y: 498 },
    smallRegion: true,
  },
  대전광역시: {
    slug: "daejeon",
    label: "대전",
    shortLabel: "대전",
    center: { x: 325, y: 349 },
    labelCenter: { x: 323, y: 338 },
    smallRegion: true,
  },
  울산광역시: {
    slug: "ulsan",
    label: "울산",
    shortLabel: "울산",
    center: { x: 560, y: 474 },
    labelCenter: { x: 573, y: 472 },
    smallRegion: true,
  },
  세종특별자치시: {
    slug: "sejong",
    label: "세종",
    shortLabel: "세종",
    center: { x: 294, y: 292 },
    labelCenter: { x: 292, y: 280 },
    smallRegion: true,
  },
  경기도: {
    slug: "gyeonggi",
    label: "경기",
    shortLabel: "경기",
    center: { x: 252, y: 214 },
    labelCenter: { x: 256, y: 220 },
    smallRegion: false,
  },
  강원도: {
    slug: "gangwon",
    label: "강원",
    shortLabel: "강원",
    center: { x: 469, y: 180 },
    labelCenter: { x: 494, y: 184 },
    smallRegion: false,
  },
  충청북도: {
    slug: "chungbuk",
    label: "충북",
    shortLabel: "충북",
    center: { x: 365, y: 280 },
    smallRegion: false,
  },
  충청남도: {
    slug: "chungnam",
    label: "충남",
    shortLabel: "충남",
    center: { x: 215, y: 316 },
    labelCenter: { x: 204, y: 322 },
    smallRegion: false,
  },
  전라북도: {
    slug: "jeonbuk",
    label: "전북",
    shortLabel: "전북",
    center: { x: 244, y: 439 },
    smallRegion: false,
  },
  전라남도: {
    slug: "jeonnam",
    label: "전남",
    shortLabel: "전남",
    center: { x: 180, y: 561 },
    labelCenter: { x: 165, y: 554 },
    smallRegion: false,
  },
  경상북도: {
    slug: "gyeongbuk",
    label: "경북",
    shortLabel: "경북",
    center: { x: 525, y: 328 },
    labelCenter: { x: 548, y: 334 },
    smallRegion: false,
  },
  경상남도: {
    slug: "gyeongnam",
    label: "경남",
    shortLabel: "경남",
    center: { x: 432, y: 562 },
    labelCenter: { x: 445, y: 570 },
    smallRegion: false,
  },
  제주특별자치도: {
    slug: "jeju",
    label: "제주",
    shortLabel: "제주",
    center: { x: 219, y: 715 },
    labelCenter: { x: 219, y: 715 },
    smallRegion: false,
  },
} as const;

export function RegionMapOverview() {
  const router = useRouter();
  const [hoveredRegionSlug, setHoveredRegionSlug] = useState<string | null>(null);
  const [selectedRegionSlug, setSelectedRegionSlug] = useState<string>("seoul");

  const koreaRegions = useMemo(
    () =>
      koreaSidoMap.paths
        .map((path) => {
          const metadata =
            KOREA_REGION_METADATA[
              path.id as keyof typeof KOREA_REGION_METADATA
            ] ?? null;

          if (!metadata) {
            return null;
          }

          const dashboardRegion =
            DASHBOARD_REGIONS[
              metadata.slug as keyof typeof DASHBOARD_REGIONS
            ] ?? null;

          return {
            id: path.id,
            d: path.d,
            fillRule: path.fillRule,
            ...metadata,
            supported: dashboardRegion?.supported ?? false,
          };
        })
        .filter((region) => region !== null),
    []
  );

  const hoveredRegion = useMemo(
    () =>
      koreaRegions.find((region) => region.slug === hoveredRegionSlug) ?? null,
    [hoveredRegionSlug, koreaRegions]
  );

  const selectedRegion = useMemo(
    () =>
      DASHBOARD_REGIONS[selectedRegionSlug as keyof typeof DASHBOARD_REGIONS] ?? null,
    [selectedRegionSlug]
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <MapPanelHeader
        eyebrow="Entry"
        title="전국 선거 대시보드"
        description="전국지도를 먼저 보고, 활성 지역을 클릭해 지역 대시보드로 진입합니다."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#f8fbff_0%,#f1f5f9_100%)] p-4 shadow-sm">
            <div className="mx-auto min-h-[710px] w-full">
              <svg
                viewBox={koreaSidoMap.viewBox}
                className="h-full min-h-[710px] w-full"
                role="img"
                aria-label="대한민국 지도"
                shapeRendering="geometricPrecision"
                textRendering="geometricPrecision"
                preserveAspectRatio="xMidYMid meet"
              >
                <title>대한민국 지도</title>
                <rect
                  x="0"
                  y="0"
                  width="800"
                  height="759"
                  rx="32"
                  fill="transparent"
                />

                <g transform="translate(-46 -54) scale(1.19)">
                  {koreaRegions.map((region) => {
                  const isHovered = hoveredRegionSlug === region.slug;
                  const isSelected = selectedRegionSlug === region.slug;
                  const fill = isSelected
                    ? "#3b82f6"
                    : isHovered
                      ? "#bfdbfe"
                      : "#e2e8f0";
                  const stroke = isSelected
                    ? "#1d4ed8"
                    : isHovered
                      ? "#60a5fa"
                      : "#94a3b8";

                  return (
                    <g
                      key={region.slug}
                      onMouseEnter={() => setHoveredRegionSlug(region.slug)}
                      onMouseLeave={() => setHoveredRegionSlug(null)}
                      onClick={() => {
                        if (region.slug === "seoul") {
                          router.push("/dashboard/seoul");
                          return;
                        }

                        setSelectedRegionSlug(region.slug);
                      }}
                      className="cursor-pointer outline-none"
                    >
                      <path
                        d={region.d}
                        fillRule={region.fillRule ?? "nonzero"}
                        clipRule={region.fillRule ?? "nonzero"}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isSelected ? 2.2 : isHovered ? 1.8 : 1.4}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        className="transition-colors duration-150 ease-out"
                        style={{
                          cursor: "pointer",
                          opacity: 1,
                        }}
                      />
                    </g>
                  );
                })}
                  {koreaRegions.map((region) => {
                  const isHovered = hoveredRegionSlug === region.slug;
                  const isSelected = selectedRegionSlug === region.slug;

                  if (!isHovered && !isSelected) {
                    return null;
                  }

                  return (
                    <path
                      key={`${region.slug}-outline`}
                      d={region.d}
                      fill="none"
                      stroke={isSelected ? "#1d4ed8" : "#60a5fa"}
                      strokeWidth={isSelected ? 2.4 : 2}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="pointer-events-none"
                    />
                  );
                })}
                  {koreaRegions.map((region) => {
                  const isHovered = hoveredRegionSlug === region.slug;
                  const isSelected = selectedRegionSlug === region.slug;
                  const labelCenter = region.labelCenter ?? region.center;

                  return (
                    <text
                      key={`${region.slug}-label`}
                      x={labelCenter.x}
                      y={labelCenter.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontSize: region.smallRegion
                          ? isHovered || isSelected
                            ? "16px"
                            : "14px"
                          : isHovered || isSelected
                            ? "24px"
                            : "21px",
                        fontWeight: isHovered || isSelected ? 800 : 700,
                        fill: "#111827",
                        paintOrder: "stroke",
                        stroke: isSelected ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.98)",
                        strokeWidth: region.smallRegion
                          ? isHovered || isSelected
                            ? 3.4
                            : 3.1
                          : isHovered || isSelected
                            ? 4.4
                            : 3.8,
                        letterSpacing: "-0.02em",
                      }}
                      className="pointer-events-none select-none"
                    >
                      {region.smallRegion ? region.shortLabel : region.label}
                    </text>
                  );
                })}
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:h-[680px] lg:overflow-y-auto lg:pr-1">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">현재 포커스</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {hoveredRegion?.label ?? selectedRegion?.label ?? "지역을 선택해보세요"}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {hoveredRegion
                ? `${hoveredRegion.label} 영역 위에 마우스를 올리고 있습니다. 클릭하면 우측 패널이 해당 지역 기준으로 바뀝니다.`
                : selectedRegion
                  ? selectedRegion.supported
                    ? "서울은 실제 대시보드 흐름이 연결되어 있습니다."
                    : "이 지역은 구조만 준비되어 있고 상세 데이터는 아직 없습니다."
                  : "지역을 클릭해 선거 종류를 확인하세요."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">선택 지역</p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-900">
                  {selectedRegion?.label ?? "지역 선택"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedRegion?.headline ?? "우측 패널에서 선거 종류를 선택하세요."}
                </p>
              </div>
              {selectedRegion && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    selectedRegion.supported
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedRegion.supported ? "활성 지역" : "준비 중"}
                </span>
              )}
            </div>

            {selectedRegion && (
              <div className="mt-4 space-y-3">
                {DASHBOARD_ELECTIONS.map((election) => (
                  <Link
                    key={election.electionSlug}
                    href={`/dashboard/${selectedRegion.slug}/${election.electionSlug}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-300 hover:bg-white"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {election.fallbackLabel}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        /dashboard/{selectedRegion.slug}/{election.electionSlug}
                      </p>
                    </div>
                    <span className="text-sm text-slate-500">열기</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
