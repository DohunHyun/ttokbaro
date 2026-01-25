"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Claim, fetchClaims } from "../lib/api";

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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">
              또바로
            </p>
            <h1 className="text-3xl font-semibold">최신 주장 목록</h1>
          </div>
          <Link
            href="/submit"
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
          >
            주장 제출하기
          </Link>
        </header>

        {status === "loading" && <p>주장을 불러오는 중...</p>}
        {status === "error" && (
          <p className="text-red-600">
            {error ?? "주장 목록을 불러오는 중 오류가 발생했습니다."}
          </p>
        )}

        {status === "ready" && (
          <ul className="space-y-4">
            {claims.length === 0 && (
              <li className="p-4 bg-white rounded shadow text-gray-600">
                아직 제출된 주장이 없습니다. 첫 번째 주장을 작성해보세요!
              </li>
            )}
            {claims.map((claim) => (
              <li key={claim.id} className="p-4 bg-white rounded shadow">
                <p className="text-sm text-gray-500">
                  {new Date(claim.createdAt).toLocaleString()}
                </p>
                {claim.sourceUrl ? (
                  <a
                    href={claim.sourceUrl}
                    className="text-blue-600 underline break-words"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {claim.sourceUrl}
                  </a>
                ) : (
                  <p className="font-medium whitespace-pre-line">
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
      </div>
    </div>
  );
}
