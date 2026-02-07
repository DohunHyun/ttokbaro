"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Claim, fetchClaims } from "../../lib/api";

function getHostname(url: string | null) {
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ClaimSkeleton() {
  return (
    <li className="space-y-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-6 w-5/6 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-2/5 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-3/5 animate-pulse rounded bg-slate-200" />
    </li>
  );
}

export default function ClaimsPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(50);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadClaims = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await fetchClaims(limit);
      setClaims(data);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setStatus("error");
    }
  }, [limit]);

  useEffect(() => {
    loadClaims();
  }, [loadClaims, retryCount]);

  const filteredClaims = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return claims;
    return claims.filter((claim) => {
      const text = claim.text?.toLowerCase() ?? "";
      const sourceUrl = claim.sourceUrl?.toLowerCase() ?? "";
      return text.includes(keyword) || sourceUrl.includes(keyword);
    });
  }, [claims, query]);

  const hasQuery = query.trim().length > 0;

  const handleCopy = async (claim: Claim) => {
    const value = claim.sourceUrl?.trim() || claim.text?.trim();
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(claim.id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-end justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Claims</h2>
          <p className="text-sm text-slate-600">최근 제출된 주장</p>
        </div>
        <Link
          href="/submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          주장 제출하기
        </Link>
      </header>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="텍스트 또는 URL 검색"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="검색어 지우기"
            >
              ×
            </button>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span>개수</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      {status === "loading" && (
        <ul className="space-y-3">
          <ClaimSkeleton />
          <ClaimSkeleton />
          <ClaimSkeleton />
        </ul>
      )}

      {status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p>{error ?? "주장 목록을 불러오는 중 오류가 발생했습니다."}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-3 rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700"
          >
            다시 시도
          </button>
        </div>
      )}

      {status === "ready" && (
        <ul className="space-y-3">
          {filteredClaims.length === 0 && (
            <li className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-slate-700">
                {claims.length === 0
                  ? "아직 제출된 주장이 없습니다."
                  : "검색 결과가 없어요"}
              </p>
              <Link
                href="/submit"
                className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              >
                주장 제출하기
              </Link>
            </li>
          )}
          {filteredClaims.map((claim) => (
            <li
              key={claim.id}
              className="space-y-2.5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm cursor-pointer transition hover:border-slate-300"
              onClick={() => router.push(`/claims/${claim.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/claims/${claim.id}`);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <p className="overflow-hidden text-lg leading-7 text-slate-900 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                {claim.text?.trim() || "내용 없음"}
              </p>
              <div className="flex items-center justify-between gap-3">
                {claim.sourceUrl ? (
                  <a
                    href={claim.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="block break-words text-sm text-blue-700 hover:underline"
                  >
                    <span className="font-medium text-slate-700">
                      {getHostname(claim.sourceUrl)}
                    </span>
                  </a>
                ) : (
                  <p className="text-sm text-slate-500">출처 URL 없음</p>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(claim);
                  }}
                  className="shrink-0 rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  {copiedId === claim.id ? "복사됨" : "Copy"}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <p>{new Date(claim.createdAt).toLocaleString("ko-KR")}</p>
                <p>#{claim.id}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
