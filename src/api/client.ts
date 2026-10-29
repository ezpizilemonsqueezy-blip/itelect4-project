import type { AiReview } from "../types";
import { useAuthStore } from "../store/authStore";

// These types mirror what itelect4-backend actually returns: each model's toJSON
// turns _id into id, drops __v, and timestamps: true adds createdAt/updatedAt.
// Dates arrive as ISO strings because they pass through JSON.
export type ItemStatus = "Recovered" | "Claimed" | "Awaiting Pickup";
export type ItemCategory = "Electronics" | "Accessories" | "Documents" | "Personal";
export type ClaimStatus = "Pending" | "Approved" | "Rejected";
export type UserRole = "student" | "admin" | "instructor";

interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface UserRecord extends Timestamps {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CategoryRecord extends Timestamps {
  id: string;
  name: ItemCategory;
  description: string;
}

export interface ItemRecord extends Timestamps {
  id: string;
  userId: string;
  name: string;
  category: ItemCategory;
  status: ItemStatus;
  location: string;
  description: string;
  estimatedValue: number;
  foundAt: string;
}

export interface ClaimRecord extends Timestamps {
  id: string;
  itemId: string;
  userId: string;
  claimantName: string;
  email: string;
  status: ClaimStatus;
}

// Inputs are only the fields the backend accepts. id, userId and the timestamps
// are always set by the server, so the client never sends them.
export type ItemCreateInput = Pick<ItemRecord, "name" | "category" | "location" | "description"> &
  Partial<Pick<ItemRecord, "status" | "estimatedValue" | "foundAt">>;

export type ClaimCreateInput = Pick<ClaimRecord, "itemId" | "claimantName" | "email">;

export interface AuthResponse {
  token: string;
  user: UserRecord;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

interface RequestOptions extends RequestInit {
  // Private calls send the stored token as a Bearer header.
  auth?: boolean;
}

async function request<T>(path: string, { auth = false, headers, ...options }: RequestOptions = {}): Promise<T> {
  const requestHeaders = new Headers(headers);
  if (options.body) requestHeaders.set("Content-Type", "application/json");

  if (auth) {
    const token = useAuthStore.getState().token;
    if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers: requestHeaders });
  const data = response.status === 204 ? undefined : await response.json().catch(() => undefined);

  if (!response.ok) {
    // An expired or invalid token cannot be fixed by retrying, so sign out.
    if (auth && response.status === 401) useAuthStore.getState().logout();
    throw new Error(data?.message ?? `Request failed (${response.status}).`);
  }

  return data as T;
}

// Public
export function loginAccount(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function registerAccount(name: string, email: string, password: string): Promise<{ user: UserRecord }> {
  return request("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
}

export function getCategories(): Promise<CategoryRecord[]> {
  return request<CategoryRecord[]>("/api/categories");
}

// Private
export function getItems(): Promise<ItemRecord[]> {
  return request<ItemRecord[]>("/api/items", { auth: true });
}

export function getItemById(itemId: string): Promise<ItemRecord> {
  return request<ItemRecord>(`/api/items/${itemId}`, { auth: true });
}

export function createItem(input: ItemCreateInput): Promise<ItemRecord> {
  return request<ItemRecord>("/api/items", { method: "POST", body: JSON.stringify(input), auth: true });
}

export function getClaims(): Promise<ClaimRecord[]> {
  return request<ClaimRecord[]>("/api/claims", { auth: true });
}

export function createClaim(input: ClaimCreateInput): Promise<ClaimRecord> {
  return request<ClaimRecord>("/api/claims", { method: "POST", body: JSON.stringify(input), auth: true });
}

export function updateClaim(claimId: string, status: Exclude<ClaimStatus, "Pending">): Promise<ClaimRecord> {
  return request<ClaimRecord>(`/api/claims/${claimId}`, { method: "PATCH", body: JSON.stringify({ status }), auth: true });
}

export function askAi(prompt: string): Promise<AiReview> {
  return request<AiReview>("/api/ai", { method: "POST", body: JSON.stringify({ prompt }), auth: true });
}
