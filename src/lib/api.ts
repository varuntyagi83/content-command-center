import { ContentCard } from "./types";

const BASE = "/api";

export async function fetchCards(): Promise<ContentCard[]> {
  const res = await fetch(`${BASE}/cards`);
  if (!res.ok) throw new Error("Failed to fetch cards");
  const data = await res.json();
  return data.cards;
}

export async function apiAddCard(card: Partial<ContentCard>): Promise<ContentCard> {
  const res = await fetch(`${BASE}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card),
  });
  const data = await res.json();
  return data.card;
}

export async function apiUpdateCard(id: string, updates: Partial<ContentCard>): Promise<void> {
  await fetch(`${BASE}/cards`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, updates }),
  });
}

export async function apiDeleteCard(id: string): Promise<void> {
  await fetch(`${BASE}/cards?id=${id}`, { method: "DELETE" });
}

export async function apiBulkKeep(ids: string[]): Promise<void> {
  await fetch(`${BASE}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "bulk_keep", ids }),
  });
}

export async function apiBulkReject(ids: string[]): Promise<void> {
  await fetch(`${BASE}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "bulk_reject", ids }),
  });
}

export async function apiAddComment(cardId: string, author: string, text: string) {
  const res = await fetch(`${BASE}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardId, author, text }),
  });
  const data = await res.json();
  return data.comment;
}

export async function apiSeed(): Promise<void> {
  await fetch(`${BASE}/seed`, { method: "POST" });
}
