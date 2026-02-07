"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ApiError, Claim, fetchClaimById } from "../../../lib/api";

export default function ClaimDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [claim, setClaim] = useState<Claim | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  const loadClaim = useCallback(async () => {
    if (!Number.isFinite(id) || id <= 0) {
      setStatus("error");
      setError("존재하지 않는 주장입니다");
      return;
    }

    setStatus("loading");
    setError(null);
    try {
      const data = await fetchClaimById(id);
      setClaim(data);
      setStatus("ready");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError("존재하지 않는 주장입니다");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "주장 상세를 불러오는 중 오류가 발생했습니다."
        );
      }
      setStatus("error");
    }
  }, [id]);

  useEffect(() => {
    loadClaim();
  }, [loadClaim]);

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-3xl font-bold text-slate-900">Claim Detail</h2>
        <p className="text-sm text-slate-600">주장 상세 보기</p>
      </header>

      {status === "loading" && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-slate-600">불러오는 중...</p>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
          <p>{error ?? "주장 상세를 불러오지 못했습니다."}</p>
          <button
            type="button"
            onClick={loadClaim}
            className="mt-3 rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700"
          >
            다시 시도
          </button>
        </div>
      )}

      {status === "ready" && claim && (
        <article className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <p>#{claim.id}</p>
            <p>{new Date(claim.createdAt).toLocaleString("ko-KR")}</p>
          </div>
          <p className="whitespace-pre-line text-lg leading-7 text-slate-900">
            {claim.text?.trim() || "내용 없음"}
          </p>
          {claim.sourceUrl && (
            <a
              href={claim.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="block break-words text-sm text-blue-700 underline"
            >
              {claim.sourceUrl}
            </a>
          )}
        </article>
      )}

      <Link href="/claims" className="inline-block text-sm text-blue-700 underline">
        목록으로 돌아가기
      </Link>
    </section>
  );
}
