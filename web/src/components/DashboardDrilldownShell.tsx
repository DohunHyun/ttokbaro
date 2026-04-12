"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import koreaSidoMap from "../data/korea-sido-map.json";
import seoulDistrictMap from "../data/seoul-district-map.json";
import {
  DASHBOARD_ELECTIONS,
  DASHBOARD_REGIONS,
  getSeoulDistrict,
  SEOUL_DISTRICTS,
} from "../lib/dashboard";
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

const DISTRICT_LABEL_OVERRIDES: Record<string, { x: number; y: number }> = {
  종로구: { x: 382, y: 210 },
  중구: { x: 440, y: 348 },
  용산구: { x: 402, y: 414 },
  성동구: { x: 526, y: 365 },
  광진구: { x: 615, y: 375 },
  동대문구: { x: 550, y: 287 },
  중랑구: { x: 624, y: 242 },
  성북구: { x: 480, y: 256 },
  강북구: { x: 490, y: 179 },
  도봉구: { x: 509, y: 104 },
  노원구: { x: 590, y: 160 },
  은평구: { x: 306, y: 204 },
  서대문구: { x: 327, y: 305 },
  마포구: { x: 278, y: 357 },
  양천구: { x: 183, y: 443 },
  강서구: { x: 87, y: 329 },
  구로구: { x: 131, y: 515 },
  금천구: { x: 269, y: 617 },
  영등포구: { x: 264, y: 434 },
  동작구: { x: 325, y: 479 },
  관악구: { x: 344, y: 579 },
  서초구: { x: 457, y: 524 },
  강남구: { x: 533, y: 463 },
  송파구: { x: 669, y: 473 },
  강동구: { x: 717, y: 371 },
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

type DashboardDrilldownShellProps = {
  regionSlug?: string | null;
  districtSlug?: string | null;
};

export function DashboardDrilldownShell({
  regionSlug,
  districtSlug,
}: DashboardDrilldownShellProps) {
  const router = useRouter();
  const isSeoulDetail = regionSlug === "seoul";

  const [hoveredRegionSlug, setHoveredRegionSlug] = useState<string | null>(null);
  const [selectedRegionSlug, setSelectedRegionSlug] = useState<string>("seoul");
  const [hoveredDistrictSlug, setHoveredDistrictSlug] = useState<string | null>(
    null
  );
  const [selectedDistrictSlug, setSelectedDistrictSlug] = useState<string | null>(
    districtSlug ?? null
  );

  useEffect(() => {
    if (districtSlug) {
      setSelectedDistrictSlug(districtSlug);
      return;
    }

    setSelectedDistrictSlug(null);
  }, [districtSlug]);

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

  const districtMetadata = useMemo(
    () =>
      Object.fromEntries(
        SEOUL_DISTRICTS.map((district) => [
          district.label,
          {
            ...district,
          },
        ])
      ),
    []
  );

  const seoulDistricts = useMemo(
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

  const hoveredRegion = useMemo(
    () =>
      koreaRegions.find((region) => region.slug === hoveredRegionSlug) ?? null,
    [hoveredRegionSlug, koreaRegions]
  );

  const selectedRegion = useMemo(
    () =>
      DASHBOARD_REGIONS[selectedRegionSlug as keyof typeof DASHBOARD_REGIONS] ??
      null,
    [selectedRegionSlug]
  );

  const selectedDistrict = selectedDistrictSlug
    ? getSeoulDistrict(selectedDistrictSlug)
    : null;

  const panelDistrict = selectedDistrict;
  const panelRegion = hoveredRegion ?? selectedRegion;

  const headerTitle = isSeoulDetail ? "서울 선거 대시보드" : "전국 선거 대시보드";
  const headerDescription = isSeoulDetail
    ? panelDistrict
      ? `${panelDistrict.label}를 기준으로 우측 보드와 선거 종류를 살펴볼 수 있습니다.`
      : "서울 지도를 보고 자치구를 선택하면 우측 보드가 같은 화면 안에서 함께 바뀝니다."
    : "전국지도를 먼저 보고, 활성 지역을 클릭해 지역 대시보드로 진입합니다.";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <MapPanelHeader
        eyebrow="Entry"
        title={headerTitle}
        description={headerDescription}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#f8fbff_0%,#f1f5f9_100%)] p-4 shadow-sm">
            {isSeoulDetail && (
              <button
                type="button"
                onClick={() => router.push("/dashboard", { scroll: false })}
                className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
              >
                ← 전국 지도로
              </button>
            )}

            {!isSeoulDetail && (
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
                              setSelectedRegionSlug("seoul");
                              router.push("/dashboard/seoul", { scroll: false });
                              return;
                            }

                            setSelectedRegionSlug(region.slug);
                          }}
                          className="cursor-pointer"
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
                            style={{ cursor: "pointer" }}
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
                            stroke: isSelected
                              ? "rgba(255,255,255,0.82)"
                              : "rgba(255,255,255,0.98)",
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
            )}

            {isSeoulDetail && (
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
                  <rect
                    x="0"
                    y="0"
                    width="800"
                    height="666"
                    fill="transparent"
                  />

                  <g transform="translate(-18 -10) scale(1.05)">
                    {seoulDistricts.map((district) => {
                      const isHovered = hoveredDistrictSlug === district.slug;
                      const isSelected = selectedDistrictSlug === district.slug;

                      return (
                        <g
                          key={district.slug}
                          onMouseEnter={() => setHoveredDistrictSlug(district.slug)}
                          onMouseLeave={() => setHoveredDistrictSlug(null)}
                          onClick={() => {
                            setSelectedDistrictSlug(district.slug);
                            router.replace(`/dashboard/seoul/${district.slug}`, {
                              scroll: false,
                            });
                          }}
                          className="cursor-pointer"
                        >
                          <path
                            d={district.d}
                            fill={
                              isSelected ? "#3b82f6" : isHovered ? "#bfdbfe" : "#e2e8f0"
                            }
                            stroke="#cbd5e1"
                            strokeWidth={1.35}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                            className="transition-colors duration-150 ease-out"
                            style={{ cursor: "pointer" }}
                          />
                        </g>
                      );
                    })}

                    {seoulDistricts.map((district) => {
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
                          strokeWidth={isSelected ? 2.4 : 2.1}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          className="pointer-events-none"
                        />
                      );
                    })}

                    {seoulDistricts.map((district) => {
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
                            fontSize: isHovered || isSelected ? "15px" : "13px",
                            fontWeight: isHovered || isSelected ? 800 : 700,
                            fill: "#111827",
                            paintOrder: "stroke",
                            stroke: "rgba(255,255,255,0.95)",
                            strokeWidth: isHovered || isSelected ? 3 : 2.6,
                            letterSpacing: "-0.02em",
                          }}
                          className="pointer-events-none select-none"
                        >
                          {district.label}
                        </text>
                      );
                    })}
                  </g>
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 lg:h-[720px] lg:overflow-y-auto lg:pr-1">
          {!isSeoulDetail && (
            <>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">현재 포커스</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {panelRegion?.label ?? "지역을 선택해보세요"}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {hoveredRegion
                    ? `${hoveredRegion.label} 영역 위에 마우스를 올리고 있습니다. 서울을 클릭하면 같은 대시보드 안에서 상세 지도로 drill-down합니다.`
                    : panelRegion?.supported
                      ? "서울은 drill-down 상세 지도가 연결되어 있습니다."
                      : "이 지역은 구조만 준비되어 있고 상세 데이터는 아직 없습니다."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">선택 지역</p>
                    <h3 className="mt-1 text-2xl font-semibold text-slate-900">
                      {panelRegion?.label ?? "지역 선택"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {panelRegion?.headline ?? "전국 지도에서 지역을 선택하세요."}
                    </p>
                  </div>
                  {panelRegion && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        panelRegion.supported
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {panelRegion.supported ? "상세 진입 가능" : "준비 중"}
                    </span>
                  )}
                </div>

                {panelRegion && (
                  <div className="mt-4 space-y-3">
                    {panelRegion.slug === "seoul" ? (
                      <button
                        type="button"
                        onClick={() =>
                          router.push("/dashboard/seoul", { scroll: false })
                        }
                        className="flex w-full items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-left transition hover:border-blue-300 hover:bg-white"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            서울 상세 지도 열기
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            /dashboard/seoul
                          </p>
                        </div>
                        <span className="text-sm text-slate-500">열기</span>
                      </button>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                        이 지역의 2레벨 상세 지도는 아직 준비 중입니다.
                      </div>
                    )}

                    {DASHBOARD_ELECTIONS.map((election) => (
                      <Link
                        key={election.electionSlug}
                        href={`/dashboard/${panelRegion.slug}/${election.electionSlug}`}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-300 hover:bg-white"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {election.fallbackLabel}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            /dashboard/{panelRegion.slug}/{election.electionSlug}
                          </p>
                        </div>
                        <span className="text-sm text-slate-500">열기</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {isSeoulDetail && (
            <>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">현재 포커스</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {panelDistrict?.label ?? "서울 전체"}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {panelDistrict
                    ? `${panelDistrict.group} 기준으로 선거 종류를 선택할 수 있습니다. 지도에서 다른 자치구를 클릭하면 우측 보드가 같은 화면 안에서 갱신됩니다.`
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
                        : "자치구를 선택하면 구 단위 문맥이 반영됩니다."}
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}
