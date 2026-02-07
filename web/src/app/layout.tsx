import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "똑바로",
  description: "팩트체크 & 편향 검증 커뮤니티",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="w-full border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">똑바로</h1>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded">
            로그인
          </button>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
