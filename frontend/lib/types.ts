/**
 * Types mirroring the real FastAPI backend response shapes.
 * Verified directly against /docs (Swagger) responses — keep
 * these in sync if a teammate changes a router's response_model.
 */

export type RiskLevelApi = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ScanResultApi = "SAFE" | "PHISHING";
export type ScanTypeApi = "URL" | "EMAIL" | "TEXT";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
}

export interface ScanRequest {
  url: string;
}

export interface EmailScanRequest {
  email_text: string;
}

export interface TextScanRequest {
  text: string;
}

export interface ScanResult {
  id: number;
  scan_type: ScanTypeApi;
  content: string;
  result: ScanResultApi;
  risk_score: number;
  risk_level: RiskLevelApi;
  created_at: string;
  user_id?: number;
  updated_at?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Report {
  id: number;
  user_id: number;
  scan_id: number;
  report_type: string;
  details: string;
  created_at: string;
}

export interface TeamSummary {
  id: number;
  name: string;
  owner_id: number;
  created_at: string;
}

export interface TeamMemberUser {
  id: number;
  name: string;
  email: string;
}

export interface TeamMember {
  id: number;
  user_id: number;
  added_at: string;
  user: TeamMemberUser;
}

export interface TeamDetail {
  team: TeamSummary;
  members: TeamMember[];
}

export interface DashboardStats {
  total_scans: number;
  safe_scans: number;
  phishing_scans: number;
  high_risk_scans: number;
}

export interface RiskDistribution {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
  CRITICAL: number;
}

export interface MonthlyScanPoint {
  month: number;
  count: number;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}