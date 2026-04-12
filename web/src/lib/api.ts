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
  parentEvidenceId: number | null;
  url: string | null;
  note: string | null;
  createdAt: string;
};

export type DashboardElectionOption = {
  electionType: string;
  label: string;
  candidateCount: number;
  available: boolean;
};

export type DashboardCandidateCard = {
  id: number;
  name: string;
  partyName: string | null;
  number: string | null;
  photoUrl: string | null;
  electionType: string | null;
  region: string | null;
  districtName: string | null;
};

export type DashboardCandidateDetail = {
  id: number;
  name: string;
  partyName: string | null;
  number: string | null;
  photoUrl: string | null;
  electionType: string | null;
  region: string | null;
  districtName: string | null;
  age: string | null;
  gender: string | null;
  job: string | null;
  education: string | null;
  career: string | null;
  homepageUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
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
  payload: { parentEvidenceId?: number; url?: string; note?: string }
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

export async function deleteEvidence(evidenceId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/evidences/${evidenceId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const body = await safeJson(response);
  if (!response.ok) {
    const message =
      (body as { message?: string } | null)?.message ??
      "근거를 삭제하지 못했습니다.";
    throw new ApiError(message, response.status);
  }
}

export async function fetchSeoulDashboardElections(): Promise<
  DashboardElectionOption[]
> {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/regions/seoul/elections`,
    {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  const body = await safeJson(response);
  if (!response.ok) {
    const message =
      (body as { message?: string } | null)?.message ??
      "선거 종류를 불러오지 못했습니다.";
    throw new ApiError(message, response.status);
  }

  return body as DashboardElectionOption[];
}

export async function fetchDashboardCandidates(params: {
  region: string;
  electionType: string;
}): Promise<DashboardCandidateCard[]> {
  const searchParams = new URLSearchParams({
    region: params.region,
    electionType: params.electionType,
  });

  const response = await fetch(
    `${API_BASE_URL}/dashboard/candidates?${searchParams.toString()}`,
    {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  const body = await safeJson(response);
  if (!response.ok) {
    const message =
      (body as { message?: string } | null)?.message ??
      "후보 목록을 불러오지 못했습니다.";
    throw new ApiError(message, response.status);
  }

  return body as DashboardCandidateCard[];
}

export async function fetchDashboardCandidateById(
  id: number
): Promise<DashboardCandidateDetail> {
  const response = await fetch(`${API_BASE_URL}/dashboard/candidates/${id}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const body = await safeJson(response);
  if (!response.ok) {
    const message =
      (body as { message?: string } | null)?.message ??
      "후보 상세를 불러오지 못했습니다.";
    throw new ApiError(message, response.status);
  }

  return body as DashboardCandidateDetail;
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
