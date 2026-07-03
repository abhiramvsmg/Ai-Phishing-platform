import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ScanRequest,
  EmailScanRequest,
  TextScanRequest,
  ScanResult,
  DashboardStats,
  RiskDistribution,
  MonthlyScanPoint,
  UserProfile,
  Report,
  TeamSummary,
  TeamDetail,
  ApiError,
} from "@/lib/types";

/**
 * Base URL for the FastAPI backend.
 *
 * IMPORTANT: this is 8001, not 8000 — Splunk's daemon (splunkd)
 * occupies port 8000 on this machine, so the backend is run with
 * `uvicorn main:app --reload --port 8001`. If a teammate's machine
 * doesn't have that conflict, they'd run on 8000 and need to
 * override this via NEXT_PUBLIC_API_BASE_URL in .env.local instead
 * of changing this file.
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8001";

const TOKEN_KEY = "phishguard_token";

/**
 * Token storage. Plain localStorage for now — fine for local dev
 * and a student project. If this ships to real users, move to an
 * httpOnly cookie set by a Next.js route handler instead, since
 * localStorage tokens are readable by any script on the page (XSS
 * risk).
 */
export const tokenStore = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean; // attach Authorization header if true
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = tokenStore.get();
    if (!token) {
      throw new ApiError("Not authenticated — no token found", 401);
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch itself throws on network failure (server down, CORS
    // block before any response, etc.) — distinguish this from a
    // normal HTTP error status below.
    throw new ApiError(
      "Could not reach the server. Is the backend running on " + API_BASE_URL + "?",
      0
    );
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const errBody = await res.json();
      detail = errBody.detail ?? detail;
    } catch {
      // response wasn't JSON — keep statusText
    }
    throw new ApiError(
      typeof detail === "string" ? detail : JSON.stringify(detail),
      res.status
    );
  }

  // Some endpoints (e.g. register) return 201 with a small body;
  // guard against an empty body breaking .json()
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}

/**
 * Separate from request<T>() because export endpoints return raw
 * file bytes (FileResponse on the backend), not JSON. Triggers a
 * browser download directly rather than returning parsed data.
 */
async function downloadFile(
  path: string,
  fallbackFilename: string
): Promise<void> {
  const token = tokenStore.get();
  if (!token) {
    throw new ApiError("Not authenticated — no token found", 401);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new ApiError(
      "Could not reach the server. Is the backend running on " + API_BASE_URL + "?",
      0
    );
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const errBody = await res.json();
      detail = errBody.detail ?? detail;
    } catch {
      // not JSON, keep statusText
    }
    throw new ApiError(typeof detail === "string" ? detail : JSON.stringify(detail), res.status);
  }

  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition");
  const match = disposition?.match(/filename="?([^"]+)"?/);
  const filename = match?.[1] ?? fallbackFilename;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * All methods here are verified directly against the backend's
 * live Swagger /docs responses, not assumed from the README.
 */
export const api = {
  auth: {
    register: (data: RegisterRequest) =>
      request<RegisterResponse>("/api/v1/auth/register", {
        method: "POST",
        body: data,
      }),

    login: async (data: LoginRequest) => {
      const result = await request<LoginResponse>("/api/v1/auth/login", {
        method: "POST",
        body: data,
      });
      tokenStore.set(result.access_token);
      return result;
    },

    logout: () => {
      tokenStore.clear();
    },
  },

  users: {
    me: () => request<UserProfile>("/api/v1/users/me", { auth: true }),

    updateName: (name: string) =>
      request<UserProfile>("/api/v1/users/me", {
        method: "PUT",
        body: { name },
        auth: true,
      }),

    changePassword: (currentPassword: string, newPassword: string) =>
      request<{ message: string }>("/api/v1/users/me/password", {
        method: "PUT",
        body: { current_password: currentPassword, new_password: newPassword },
        auth: true,
      }),
  },

  scans: {
    scanUrl: (data: ScanRequest) =>
      request<ScanResult>("/api/v1/scans/url", {
        method: "POST",
        body: data,
        auth: true,
      }),

    scanEmail: (data: EmailScanRequest) =>
      request<ScanResult>("/api/v1/scans/email", {
        method: "POST",
        body: data,
        auth: true,
      }),

    scanText: (data: TextScanRequest) =>
      request<ScanResult>("/api/v1/scans/text", {
        method: "POST",
        body: data,
        auth: true,
      }),

    list: () => request<ScanResult[]>("/api/v1/scans", { auth: true }),

    search: (keyword: string) =>
      request<ScanResult[]>(
        `/api/v1/scans/search/${encodeURIComponent(keyword)}`,
        { auth: true }
      ),

    getById: (scanId: number) =>
      request<ScanResult>(`/api/v1/scans/${scanId}`, { auth: true }),

    flagged: () => request<ScanResult[]>("/api/v1/scans/flagged", { auth: true }),
  },

  dashboard: {
    stats: () =>
      request<DashboardStats>("/api/v1/dashboard/stats", { auth: true }),

    recentScans: () =>
      request<ScanResult[]>("/api/v1/dashboard/recent-scans", { auth: true }),

    riskDistribution: () =>
      request<RiskDistribution>("/api/v1/dashboard/risk-distribution", {
        auth: true,
      }),

    monthlyScans: () =>
      request<MonthlyScanPoint[]>("/api/v1/dashboard/monthly-scans", {
        auth: true,
      }),
  },

  reports: {
    generate: (scanId: number) =>
      request<Report>(`/api/v1/reports/generate/${scanId}`, {
        method: "POST",
        auth: true,
      }),

    list: () => request<Report[]>("/api/v1/reports", { auth: true }),

    getById: (reportId: number) =>
      request<Report>(`/api/v1/reports/${reportId}`, { auth: true }),

    exportPdf: (reportId: number) =>
      downloadFile(
        `/api/v1/reports/export/pdf/${reportId}`,
        `report_${reportId}.pdf`
      ),

    exportCsv: (reportId: number) =>
      downloadFile(
        `/api/v1/reports/export/csv/${reportId}`,
        `report_${reportId}.csv`
      ),
  },

teams: {
    list: () => request<TeamSummary[]>("/api/v1/teams", { auth: true }),

    create: (name: string) =>
      request<TeamSummary>("/api/v1/teams", {
        method: "POST",
        body: { name },
        auth: true,
      }),

    getById: (teamId: number) =>
      request<TeamDetail>(`/api/v1/teams/${teamId}`, { auth: true }),

    rename: (teamId: number, name: string) =>
      request<TeamSummary>(`/api/v1/teams/${teamId}`, {
        method: "PUT",
        body: { name },
        auth: true,
      }),

    addMember: (teamId: number, email: string) =>
      request<{ message: string }>(`/api/v1/teams/${teamId}/members`, {
        method: "POST",
        body: { email },
        auth: true,
      }),

    removeMember: (teamId: number, userId: number) =>
      request<{ message: string }>(`/api/v1/teams/${teamId}/members/${userId}`, {
        method: "DELETE",
        auth: true,
      }),

    delete: (teamId: number) =>
      request<{ message: string }>(`/api/v1/teams/${teamId}`, {
        method: "DELETE",
        auth: true,
      }),
  },
};