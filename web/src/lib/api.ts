export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type Claim = {
  id: number;
  sourceUrl: string | null;
  text: string | null;
  createdAt: string;
};

export type Evidence = {
  id: number;
  claimId: number;
  url: string | null;
  note: string | null;
  createdAt: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

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

export async function fetchClaimById(id: number): Promise<Claim> {
  const response = await fetch(`${API_BASE_URL}/claims/${id}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const body = await safeJson(response);
  if (!response.ok) {
    const message =
      (body as { message?: string } | null)?.message ??
      "주장 상세를 불러오지 못했습니다.";
    throw new ApiError(message, response.status);
  }

  return body as Claim;
}

export async function fetchEvidencesByClaimId(
  claimId: number
): Promise<Evidence[]> {
  const response = await fetch(`${API_BASE_URL}/claims/${claimId}/evidences`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const body = await safeJson(response);
  if (!response.ok) {
    const message =
      (body as { message?: string } | null)?.message ??
      "근거 목록을 불러오지 못했습니다.";
    throw new ApiError(message, response.status);
  }

  return body as Evidence[];
}

export async function createEvidence(
  claimId: number,
  payload: { url?: string; note?: string }
): Promise<Evidence> {
  const response = await fetch(`${API_BASE_URL}/claims/${claimId}/evidences`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await safeJson(response);
  if (!response.ok) {
    const message =
      (body as { message?: string } | null)?.message ??
      "근거를 추가하지 못했습니다.";
    throw new ApiError(message, response.status);
  }

  return body as Evidence;
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
