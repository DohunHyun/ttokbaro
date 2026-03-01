"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  ApiError,
  Claim,
  Evidence,
  createEvidence,
  deleteEvidence,
  fetchClaimById,
  fetchEvidencesByClaimId,
} from "../../../lib/api";

function getHostname(url: string | null) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ClaimDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [claim, setClaim] = useState<Claim | null>(null);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const [evidenceStatus, setEvidenceStatus] = useState<
    "loading" | "error" | "ready"
  >("loading");
  const [evidenceError, setEvidenceError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const [deletingEvidenceId, setDeletingEvidenceId] = useState<number | null>(
    null
  );
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyUrl, setReplyUrl] = useState("");
  const [replyNote, setReplyNote] = useState("");
  const [replyFormError, setReplyFormError] = useState<string | null>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

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

  const loadEvidences = useCallback(async () => {
    if (!Number.isFinite(id) || id <= 0) {
      setEvidenceStatus("error");
      setEvidenceError("존재하지 않는 주장입니다");
      return;
    }

    setEvidenceStatus("loading");
    setEvidenceError(null);
    try {
      const data = await fetchEvidencesByClaimId(id);
      setEvidences(data);
      setEvidenceStatus("ready");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setEvidenceError("존재하지 않는 주장입니다");
      } else {
        setEvidenceError(
          err instanceof Error
            ? err.message
            : "근거 목록을 불러오는 중 오류가 발생했습니다."
        );
      }
      setEvidenceStatus("error");
    }
  }, [id]);

  useEffect(() => {
    loadClaim();
    loadEvidences();
  }, [loadClaim, loadEvidences]);

  const handleEvidenceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedUrl = url.trim();
    const normalizedNote = note.trim();
    if (!normalizedUrl && !normalizedNote) {
      setFormError("URL 또는 메모를 입력해주세요.");
      return;
    }

    setIsSubmittingEvidence(true);
    setFormError(null);
    try {
      await createEvidence(id, {
        url: normalizedUrl || undefined,
        note: normalizedNote || undefined,
      });
      setUrl("");
      setNote("");
      setDeleteError(null);
      await loadEvidences();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "근거를 추가하는 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  const handleDeleteEvidence = async (evidenceId: number) => {
    const confirmed = window.confirm("이 근거를 삭제할까요?");
    if (!confirmed) return;

    setDeletingEvidenceId(evidenceId);
    setDeleteError(null);
    try {
      await deleteEvidence(evidenceId);
      setEvidences((prev) => prev.filter((item) => item.id !== evidenceId));
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "근거를 삭제하는 중 오류가 발생했습니다."
      );
    } finally {
      setDeletingEvidenceId(null);
    }
  };

  const handleReplySubmit = async (parentId: number, e: FormEvent) => {
    e.preventDefault();
    const normalizedUrl = replyUrl.trim();
    const normalizedNote = replyNote.trim();
    if (!normalizedUrl && !normalizedNote) {
      setReplyFormError("URL 또는 메모를 입력해주세요.");
      return;
    }

    setIsSubmittingReply(true);
    setReplyFormError(null);
    try {
      await createEvidence(id, {
        parentEvidenceId: parentId,
        url: normalizedUrl || undefined,
        note: normalizedNote || undefined,
      });
      setReplyUrl("");
      setReplyNote("");
      setReplyingToId(null);
      await loadEvidences();
    } catch (err) {
      setReplyFormError(
        err instanceof Error
          ? err.message
          : "답글 근거를 추가하는 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const rootEvidences = evidences.filter((e) => e.parentEvidenceId == null);
  const childrenByParentId = evidences.reduce<Record<number, Evidence[]>>(
    (acc, e) => {
      if (e.parentEvidenceId != null) {
        (acc[e.parentEvidenceId] ??= []).push(e);
      }
      return acc;
    },
    {}
  );

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
        <>
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

          <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">근거</h3>
              <p className="text-sm text-slate-600">주장을 뒷받침하는 링크/메모</p>
            </div>

            <form onSubmit={handleEvidenceSubmit} className="space-y-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="근거 메모를 입력하세요"
                rows={3}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <button
                type="submit"
                disabled={isSubmittingEvidence}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {isSubmittingEvidence ? "추가 중..." : "근거 추가"}
              </button>
              {formError && <p className="text-sm text-red-600">{formError}</p>}
            </form>

            {evidenceStatus === "loading" && (
              <p className="text-sm text-slate-600">근거를 불러오는 중...</p>
            )}
            {evidenceStatus === "error" && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <p>{evidenceError ?? "근거 목록을 불러오지 못했습니다."}</p>
                <button
                  type="button"
                  onClick={loadEvidences}
                  className="mt-2 rounded border border-red-300 bg-white px-2 py-1 text-xs font-medium text-red-700"
                >
                  다시 시도
                </button>
              </div>
            )}
            {evidenceStatus === "ready" && evidences.length === 0 && (
              <p className="text-sm text-slate-600">아직 등록된 근거가 없습니다.</p>
            )}
            {evidenceStatus === "ready" && rootEvidences.length > 0 && (
              <ul className="space-y-3">
                {rootEvidences.map((evidence) => (
                  <li key={evidence.id} className="space-y-2">
                    <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (replyingToId === evidence.id) {
                              setReplyingToId(null);
                              setReplyUrl("");
                              setReplyNote("");
                              setReplyFormError(null);
                            } else {
                              setReplyingToId(evidence.id);
                              setReplyUrl("");
                              setReplyNote("");
                              setReplyFormError(null);
                            }
                          }}
                          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          {replyingToId === evidence.id ? "취소" : "답글 근거 추가"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvidence(evidence.id)}
                          disabled={deletingEvidenceId === evidence.id}
                          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-60"
                        >
                          {deletingEvidenceId === evidence.id ? "삭제 중..." : "삭제"}
                        </button>
                      </div>
                      {evidence.url && (
                        <a
                          href={evidence.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block break-words text-sm text-blue-700 hover:underline"
                        >
                          {getHostname(evidence.url)}
                        </a>
                      )}
                      {evidence.note && (
                        <p className="whitespace-pre-line text-sm text-slate-800">
                          {evidence.note}
                        </p>
                      )}
                      <p className="text-xs text-slate-500">
                        {new Date(evidence.createdAt).toLocaleString("ko-KR")}
                      </p>
                    </div>

                    {replyingToId === evidence.id && (
                      <form
                        onSubmit={(e) => handleReplySubmit(evidence.id, e)}
                        className="ml-6 space-y-2 rounded-md border border-blue-200 bg-blue-50 p-3"
                      >
                        <input
                          type="url"
                          value={replyUrl}
                          onChange={(e) => setReplyUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                        <textarea
                          value={replyNote}
                          onChange={(e) => setReplyNote(e.target.value)}
                          placeholder="답글 메모를 입력하세요"
                          rows={2}
                          className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingReply}
                          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
                        >
                          {isSubmittingReply ? "추가 중..." : "답글 추가"}
                        </button>
                        {replyFormError && (
                          <p className="text-sm text-red-600">{replyFormError}</p>
                        )}
                      </form>
                    )}

                    {(childrenByParentId[evidence.id] ?? []).map((child) => (
                      <div
                        key={child.id}
                        className="ml-6 space-y-2 rounded-md border border-slate-200 bg-white p-3"
                      >
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteEvidence(child.id)}
                            disabled={deletingEvidenceId === child.id}
                            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-60"
                          >
                            {deletingEvidenceId === child.id ? "삭제 중..." : "삭제"}
                          </button>
                        </div>
                        {child.url && (
                          <a
                            href={child.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block break-words text-sm text-blue-700 hover:underline"
                          >
                            {getHostname(child.url)}
                          </a>
                        )}
                        {child.note && (
                          <p className="whitespace-pre-line text-sm text-slate-800">
                            {child.note}
                          </p>
                        )}
                        <p className="text-xs text-slate-500">
                          {new Date(child.createdAt).toLocaleString("ko-KR")}
                        </p>
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
            )}
            {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
          </section>
        </>
      )}

      <Link href="/claims" className="inline-block text-sm text-blue-700 underline">
        목록으로 돌아가기
      </Link>
    </section>
  );
}
