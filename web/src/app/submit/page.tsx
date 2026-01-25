"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClaim } from "../../lib/api";

export default function SubmitPage() {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);

    try {
      await createClaim({
        sourceUrl: url.trim() || undefined,
        text: text.trim() || undefined,
      });

      setStatus("success");
      setMessage("제출이 완료되었습니다.");
      setUrl("");
      setText("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "제출 중 문제가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded space-y-4">
      <h2 className="text-lg font-semibold">주장 제출하기</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">기사 URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="https://example.com/article"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">직접 입력</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={4}
            placeholder="검증할 발언이나 내용을 입력하세요"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "제출 중..." : "제출"}
        </button>
      </form>

      {message && (
        <p
          className={`text-sm ${
            status === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      <p className="text-sm text-gray-600">
        최근 주장 목록은 <Link href="/">메인 페이지</Link>에서 확인할 수 있어요.
      </p>
    </div>
  );
}
