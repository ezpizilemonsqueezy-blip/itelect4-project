import type { AiReview } from "../types";

export type ItemStatus = "Recovered" | "Claimed" | "Awaiting Pickup";
export type ItemCategory = "Electronics" | "Accessories" | "Documents" | "Personal";
export type ClaimStatus = "Pending" | "Approved" | "Rejected";

export interface ItemRecord {
  id: string;
  name: string;
  category: ItemCategory;
  status: ItemStatus;
  location: string;
  description: string;
  foundAt: string;
}

export interface ClaimRecord {
  id: string;
  itemId: string;
  claimantName: string;
  email: string;
  status: ClaimStatus;
  createdAt: string;
}

export type ItemCreateInput = Omit<ItemRecord, "id" | "foundAt"> & {
  id?: string;
  foundAt?: string;
};

export type ClaimCreateInput = Omit<ClaimRecord, "id" | "createdAt"> & {
  id?: string;
  createdAt?: string;
};

const API_BASE_URL = "http://localhost:3001";
const BACKEND_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string; role: string };
}

async function authRequest<T>(path: string, body: Record<string, string>): Promise<T> {
  const response = await fetch(`${BACKEND_URL}/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? `Authentication failed (${response.status}).`);
  return data as T;
}

export function loginAccount(email: string, password: string): Promise<AuthResponse> {
  return authRequest<AuthResponse>("login", { email, password });
}

export function registerAccount(name: string, email: string, password: string): Promise<{ user: AuthResponse["user"] }> {
  return authRequest("register", { name, email, password });
}

export async function askAi(prompt: string, token: string): Promise<AiReview> {
  const response = await fetch(`${BACKEND_URL}/api/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ prompt }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? `AI review failed (${response.status}).`);
  return data as AiReview;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getItems(): Promise<ItemRecord[]> {
  return request<ItemRecord[]>("/items");
}

export async function getItemById(itemId: string): Promise<ItemRecord> {
  return request<ItemRecord>(`/items/${itemId}`);
}

export async function getClaims(): Promise<ClaimRecord[]> {
  return request<ClaimRecord[]>("/claims");
}

export async function createClaim(input: ClaimCreateInput): Promise<ClaimRecord> {
  return request<ClaimRecord>("/claims", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      id: input.id ?? `claim-${Date.now()}`,
      createdAt: input.createdAt ?? new Date().toISOString(),
    }),
  });
}

export async function updateClaim(claimId: string, status: ClaimStatus): Promise<ClaimRecord> {
  return request<ClaimRecord>(`/claims/${claimId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function createItem(input: ItemCreateInput): Promise<ItemRecord> {
  return request<ItemRecord>("/items", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      id: input.id ?? `item-${Date.now()}`,
      foundAt: input.foundAt ?? new Date().toISOString(),
    }),
  });
}
