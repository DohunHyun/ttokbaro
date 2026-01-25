export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type Claim = {
  id: number;
  sourceUrl: string | null;
  text: string | null;
  createdAt: string;
};

export async function createClaim(payload: {
  sourceUrl?: string;
  text?: string;
}): Promise<Claim> {
  const response = await fetch(`${API_BASE_URL}/claims`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await safeJson(response);
  if (!response.ok) {
    const message = (body as { message?: string })?.message;
    throw new Error(message ?? "제출 중 오류가 발생했습니다.");
  }

  return body as Claim;
}

export async function fetchClaims(limit = 20): Promise<Claim[]> {
  const response = await fetch(`${API_BASE_URL}/claims?limit=${limit}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("주장 목록을 불러오지 못했습니다.");
  }

  return response.json();
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
