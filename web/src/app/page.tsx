"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Claim, fetchClaims } from "../lib/api";
import { RegionMapOverview } from "../components/RegionMapOverview";

export default function HomePage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchClaims(20)
      .then((data) => {
        if (!isMounted) return;
        setClaims(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : undefined);
        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <RegionMapOverview />

        <section className="space-y-6">
          <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Claims
              </p>
              <h2 className="mt-2 text-3xl font-semibold">최신 주장 목록</h2>
            </div>
            <Link
              href="/submit"
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
            >
              주장 제출하기
            </Link>
          </header>

          {status === "loading" && (
            <p className="rounded-xl border border-slate-200 bg-white p-4 text-slate-600 shadow-sm">
              주장을 불러오는 중...
            </p>
          )}

          {status === "error" && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 shadow-sm">
              {error ?? "주장 목록을 불러오는 중 오류가 발생했습니다."}
            </p>
          )}

          {status === "ready" && (
            <ul className="space-y-4">
              {claims.length === 0 && (
                <li className="rounded-2xl bg-white p-4 text-gray-600 shadow">
                  아직 제출된 주장이 없습니다. 첫 번째 주장을 작성해보세요!
                </li>
              )}
              {claims.map((claim) => (
                <li
                  key={claim.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm text-gray-500">
                    {new Date(claim.createdAt).toLocaleString()}
                  </p>
                  {claim.sourceUrl ? (
                    <a
                      href={claim.sourceUrl}
                      className="break-words text-blue-600 underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {claim.sourceUrl}
                    </a>
                  ) : (
                    <p className="whitespace-pre-line font-medium">
                      {claim.text}
                    </p>
                  )}
                  {claim.text && claim.sourceUrl && (
                    <p className="mt-2 whitespace-pre-line text-gray-800">
                      {claim.text}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
