"use client";
import { useState } from "react";

export default function SubmitPage() {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("제출 데이터:", { url, text });
    alert("임시 제출 완료 (API 연결 예정)");

    setUrl("");
    setText("");
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-lg font-semibold mb-4">주장 제출하기</h2>
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
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          제출
        </button>
      </form>
    </div>
  );
}