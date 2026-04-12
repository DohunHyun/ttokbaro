"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ApiError,
  DashboardCandidateCard,
  DashboardCandidateDetail,
  DashboardElectionOption,
  fetchDashboardCandidateById,
  fetchDashboardCandidates,
  fetchSeoulDashboardElections,
} from "../lib/api";
import {
  electionSlugToType,
  electionTypeToSlug,
  getDashboardRegion,
} from "../lib/dashboard";

type LoadStatus = "idle" | "loading" | "ready" | "error";

type ElectionDashboardProps = {
  regionSlug: string;
  electionSlug?: string;
  candidateId?: number | null;
};

export function ElectionDashboard({
  regionSlug,
  electionSlug,
  candidateId,
}: ElectionDashboardProps) {
  const router = useRouter();
  const region = getDashboardRegion(regionSlug);

  const [elections, setElections] = useState<DashboardElectionOption[]>([]);
  const [candidates, setCandidates] = useState<DashboardCandidateCard[]>([]);
  const [candidateDetail, setCandidateDetail] =
    useState<DashboardCandidateDetail | null>(null);

  const [electionStatus, setElectionStatus] = useState<LoadStatus>("loading");
  const [candidateStatus, setCandidateStatus] = useState<LoadStatus>("idle");
  const [detailStatus, setDetailStatus] = useState<LoadStatus>("idle");

  const [electionError, setElectionError] = useState<string | null>(null);
  const [candidateError, setCandidateError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  const selectedElectionType = electionSlug ? electionSlugToType(electionSlug) : null;

  useEffect(() => {
    let isMounted = true;

    if (!region?.supported || region.slug !== "seoul") {
      setElectionStatus("error");
      setElectionError("아직 준비되지 않은 지역입니다.");
      return () => {
        isMounted = false;
      };
    }

    setElectionStatus("loading");
    setElectionError(null);

    fetchSeoulDashboardElections()
      .then((data) => {
        if (!isMounted) return;
        setElections(data);
        setElectionStatus("ready");

        if (!electionSlug) {
          const firstAvailable = data.find((item) => item.available);
          const nextSlug = firstAvailable
            ? electionTypeToSlug(firstAvailable.electionType)
            : null;
          if (nextSlug) {
            router.replace(`/dashboard/${region.slug}/${nextSlug}`);
          }
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        setElectionError(
          error instanceof Error
            ? error.message
            : "선거 종류를 불러오는 중 오류가 발생했습니다."
        );
        setElectionStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [electionSlug, region, router]);

  useEffect(() => {
    let isMounted = true;

    if (!region?.supported || region.slug !== "seoul" || !selectedElectionType) {
      setCandidates([]);
      setCandidateStatus("idle");
      return () => {
        isMounted = false;
      };
    }

    setCandidateStatus("loading");
    setCandidateError(null);
    setCandidateDetail(null);
    setDetailStatus("idle");

    fetchDashboardCandidates({
      region: region.slug,
      electionType: selectedElectionType,
    })
      .then((data) => {
        if (!isMounted) return;
        setCandidates(data);
        setCandidateStatus("ready");

        if (!candidateId && data[0]) {
          router.replace(
            `/dashboard/${region.slug}/${electionSlug}/${data[0].id}`
          );
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        setCandidateError(
          error instanceof Error
            ? error.message
            : "후보 목록을 불러오는 중 오류가 발생했습니다."
        );
        setCandidateStatus("error");
        setCandidates([]);
      });

    return () => {
      isMounted = false;
    };
  }, [candidateId, electionSlug, region, router, selectedElectionType]);

  useEffect(() => {
    let isMounted = true;

    if (!candidateId) {
      setCandidateDetail(null);
      setDetailStatus("idle");
      return () => {
        isMounted = false;
      };
    }

    setDetailStatus("loading");
    setDetailError(null);

    fetchDashboardCandidateById(candidateId)
      .then((data) => {
        if (!isMounted) return;
        setCandidateDetail(data);
        setDetailStatus("ready");
      })
      .catch((error) => {
        if (!isMounted) return;
        setDetailError(
          error instanceof ApiError && error.status === 404
            ? "후보 정보를 찾을 수 없습니다."
            : error instanceof Error
              ? error.message
              : "후보 상세를 불러오는 중 오류가 발생했습니다."
        );
        setDetailStatus("error");
        setCandidateDetail(null);
      });

    return () => {
      isMounted = false;
    };
  }, [candidateId]);

  const selectedElection = useMemo(
    () =>
      elections.find((election) => election.electionType === selectedElectionType),
    [elections, selectedElectionType]
  );

  if (!region) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        알 수 없는 지역입니다.
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
          Dashboard
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">
          {region.headline}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          지역, 선거 종류, 후보 상세를 URL 단위로 구분할 수 있도록 정리한
          대시보드입니다.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              선거 종류 선택
            </h3>
            <p className="text-sm text-slate-500">
              이번 지방선거 기준 선거 종류 체계로 정리했습니다.
            </p>
          </div>
          {selectedElection && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              현재 선택: {selectedElection.label}
            </span>
          )}
        </div>

        {electionStatus === "loading" && (
          <p className="mt-4 text-sm text-slate-600">선거 종류를 불러오는 중...</p>
        )}

        {electionStatus === "error" && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {electionError ?? "선거 종류를 불러오지 못했습니다."}
          </div>
        )}

        {electionStatus === "ready" && (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {elections.map((election) => {
              const slug = electionTypeToSlug(election.electionType);
              const isActive =
                selectedElectionType === election.electionType && election.available;

              return (
                <button
                  key={election.electionType}
                  type="button"
                  disabled={!election.available || !slug}
                  onClick={() => router.push(`/dashboard/${region.slug}/${slug}`)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    election.available
                      ? isActive
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white"
                      : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {election.label}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{slug ?? "-"}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        election.available
                          ? "bg-white text-slate-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {election.candidateCount}명
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                후보 카드 목록
              </h3>
              <p className="text-sm text-slate-500">
                현재 URL의 선거 종류 기준으로 후보를 보여줍니다.
              </p>
            </div>
            {selectedElection && (
              <span className="text-sm text-slate-500">{selectedElection.label}</span>
            )}
          </div>

          {candidateStatus === "idle" && (
            <p className="mt-4 text-sm text-slate-600">
              선거 종류를 선택하면 후보 목록이 표시됩니다.
            </p>
          )}

          {candidateStatus === "loading" && (
            <p className="mt-4 text-sm text-slate-600">후보 목록을 불러오는 중...</p>
          )}

          {candidateStatus === "error" && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {candidateError ?? "후보 목록을 불러오지 못했습니다."}
            </div>
          )}

          {candidateStatus === "ready" && candidates.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              아직 표시할 후보 데이터가 없습니다.
            </div>
          )}

          {candidateStatus === "ready" && candidates.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {candidates.map((candidate) => {
                const isActive = candidate.id === candidateId;

                return (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/dashboard/${region.slug}/${electionSlug}/${candidate.id}`
                      )
                    }
                    className={`rounded-2xl border p-4 text-left transition ${
                      isActive
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <CandidateAvatar
                        name={candidate.name}
                        photoUrl={candidate.photoUrl}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="truncate text-base font-semibold text-slate-900">
                            {candidate.name}
                          </h4>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            기호 {formatValue(candidate.number)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {candidate.partyName || "-"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                후보 상세 정보
              </h3>
              <p className="text-sm text-slate-500">
                URL에 후보 ID가 포함되면 상세 정보를 표시합니다.
              </p>
            </div>
            {candidateId && electionSlug && (
              <Link
                href={`/dashboard/${region.slug}/${electionSlug}`}
                className="text-sm text-blue-600"
              >
                상세 닫기
              </Link>
            )}
          </div>

          {detailStatus === "idle" && (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              후보를 선택하면 상세 정보를 볼 수 있습니다.
            </div>
          )}

          {detailStatus === "loading" && (
            <p className="mt-4 text-sm text-slate-600">후보 상세를 불러오는 중...</p>
          )}

          {detailStatus === "error" && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {detailError ?? "후보 상세를 불러오지 못했습니다."}
            </div>
          )}

          {detailStatus === "ready" && candidateDetail && (
            <div className="mt-4 space-y-5">
              <div className="flex items-start gap-4">
                <CandidateAvatar
                  name={candidateDetail.name}
                  photoUrl={candidateDetail.photoUrl}
                  large
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    {candidateDetail.electionType ?? "상세"}
                  </p>
                  <h4 className="mt-1 text-2xl font-semibold text-slate-900">
                    {candidateDetail.name}
                  </h4>
                  <p className="mt-1 text-sm text-slate-600">
                    {candidateDetail.partyName || "-"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      기호 {formatValue(candidateDetail.number)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      지역 {candidateDetail.region || region.slug}
                    </span>
                    {candidateDetail.districtName && (
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        {candidateDetail.districtName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <dl className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <DetailRow label="나이" value={candidateDetail.age} />
                <DetailRow label="성별" value={candidateDetail.gender} />
                <DetailRow label="직업" value={candidateDetail.job} />
                <DetailRow label="학력" value={candidateDetail.education} />
                <DetailRow label="경력" value={candidateDetail.career} />
              </dl>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="grid grid-cols-[88px_1fr] gap-3 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="text-slate-900">{formatValue(value)}</dd>
    </div>
  );
}

function CandidateAvatar({
  name,
  photoUrl,
  large = false,
}: {
  name: string;
  photoUrl: string | null;
  large?: boolean;
}) {
  const sizeClass = large ? "h-24 w-24 text-2xl" : "h-16 w-16 text-lg";
  const fallbackText = name.slice(0, 1) || "?";

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        className={`${sizeClass} rounded-2xl border border-slate-200 bg-slate-100 object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 font-semibold text-slate-500`}
      aria-hidden="true"
    >
      {fallbackText}
    </div>
  );
}

function formatValue(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value : "-";
}
