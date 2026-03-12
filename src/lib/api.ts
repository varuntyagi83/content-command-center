import { ContentCard } from "./types";

const BASE = "/api";

async function checked(res: Response): Promise<any> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function fetchCards(): Promise<ContentCard[]> {
  const res = await fetch(`${BASE}/cards`);
  const data = await checked(res);
  return data.cards;
}

export async function apiAddCard(card: Partial<ContentCard>): Promise<ContentCard> {
  const res = await fetch(`${BASE}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card),
  });
  const data = await checked(res);
  return data.card;
}

export async function apiUpdateCard(id: string, updates: Partial<ContentCard>): Promise<void> {
  const res = await fetch(`${BASE}/cards`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, updates }),
  });
  await checked(res);
}

export async function apiDeleteCard(id: string): Promise<void> {
  const res = await fetch(`${BASE}/cards?id=${id}`, { method: "DELETE" });
  await checked(res);
}

export async function apiBulkKeep(ids: string[]): Promise<void> {
  const res = await fetch(`${BASE}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "bulk_keep", ids }),
  });
  await checked(res);
}

export async function apiBulkReject(ids: string[]): Promise<void> {
  const res = await fetch(`${BASE}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "bulk_reject", ids }),
  });
  await checked(res);
}

export async function apiAddComment(cardId: string, author: string, text: string) {
  const res = await fetch(`${BASE}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardId, author, text }),
  });
  const data = await checked(res);
  return data.comment;
}

export async function apiDeleteComment(id: string): Promise<void> {
  const res = await fetch(`${BASE}/comments?id=${id}`, { method: "DELETE" });
  await checked(res);
}

export async function apiSeed(): Promise<void> {
  const secret = process.env.NEXT_PUBLIC_SEED_SECRET;
  const url = secret ? `${BASE}/seed?secret=${encodeURIComponent(secret)}` : `${BASE}/seed`;
  const res = await fetch(url, { method: "POST" });
  await checked(res);
}
