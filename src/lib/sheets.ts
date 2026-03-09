import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { ContentCard, Comment, ColumnId } from "./types";

let _doc: GoogleSpreadsheet | null = null;

async function getDoc(): Promise<GoogleSpreadsheet> {
  if (_doc) return _doc;

  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID!, auth);
  await doc.loadInfo();
  _doc = doc;
  return doc;
}

// ── Cards Sheet ──────────────────────────────────────────────

const CARD_HEADERS = [
  "id", "title", "description", "products", "platforms", "pillar",
  "funnel", "priority", "optimization", "status", "createdAt", "updatedAt",
];

async function getCardsSheet() {
  const doc = await getDoc();
  let sheet = doc.sheetsByTitle["Cards"];
  if (!sheet) {
    sheet = await doc.addSheet({ title: "Cards", headerValues: CARD_HEADERS });
  }
  return sheet;
}

function rowToCard(row: any): ContentCard {
  return {
    id: row.get("id"),
    title: row.get("title") || "",
    description: row.get("description") || "",
    products: row.get("products") ? row.get("products").split("||") : [],
    platforms: row.get("platforms") ? row.get("platforms").split("||") : [],
    pillar: row.get("pillar") || "",
    funnel: row.get("funnel") || "",
    priority: row.get("priority") || "🟡 Medium",
    optimization: row.get("optimization") || "",
    status: (row.get("status") || "idea") as ColumnId,
    createdAt: row.get("createdAt") || new Date().toISOString(),
    updatedAt: row.get("updatedAt") || new Date().toISOString(),
    comments: [],
  };
}

export async function getAllCards(): Promise<ContentCard[]> {
  const sheet = await getCardsSheet();
  const rows = await sheet.getRows();
  const cards = rows.map(rowToCard);

  // Load comments
  const comments = await getAllComments();
  for (const card of cards) {
    card.comments = comments.filter((c) => c.cardId === card.id);
  }

  return cards;
}

export async function addCard(card: Omit<ContentCard, "comments">): Promise<ContentCard> {
  const sheet = await getCardsSheet();
  await sheet.addRow({
    id: card.id,
    title: card.title,
    description: card.description,
    products: card.products.join("||"),
    platforms: card.platforms.join("||"),
    pillar: card.pillar,
    funnel: card.funnel,
    priority: card.priority,
    optimization: card.optimization,
    status: card.status,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
  });
  return { ...card, comments: [] };
}

export async function updateCard(id: string, updates: Partial<ContentCard>): Promise<void> {
  const sheet = await getCardsSheet();
  const rows = await sheet.getRows();
  const row = rows.find((r) => r.get("id") === id);
  if (!row) throw new Error(`Card ${id} not found`);

  if (updates.title !== undefined) row.set("title", updates.title);
  if (updates.description !== undefined) row.set("description", updates.description);
  if (updates.products !== undefined) row.set("products", updates.products.join("||"));
  if (updates.platforms !== undefined) row.set("platforms", updates.platforms.join("||"));
  if (updates.pillar !== undefined) row.set("pillar", updates.pillar);
  if (updates.funnel !== undefined) row.set("funnel", updates.funnel);
  if (updates.priority !== undefined) row.set("priority", updates.priority);
  if (updates.optimization !== undefined) row.set("optimization", updates.optimization);
  if (updates.status !== undefined) row.set("status", updates.status);
  row.set("updatedAt", new Date().toISOString());
  await row.save();
}

export async function deleteCard(id: string): Promise<void> {
  const sheet = await getCardsSheet();
  const rows = await sheet.getRows();
  const row = rows.find((r) => r.get("id") === id);
  if (row) await row.delete();

  // Also delete comments for this card
  const commentsSheet = await getCommentsSheet();
  const commentRows = await commentsSheet.getRows();
  const toDelete = commentRows.filter((r) => r.get("cardId") === id);
  for (const r of toDelete) await r.delete();
}

export async function bulkUpdateStatus(ids: string[], status: ColumnId): Promise<void> {
  const sheet = await getCardsSheet();
  const rows = await sheet.getRows();
  const now = new Date().toISOString();
  for (const row of rows) {
    if (ids.includes(row.get("id"))) {
      row.set("status", status);
      row.set("updatedAt", now);
      await row.save();
    }
  }
}

export async function bulkDelete(ids: string[]): Promise<void> {
  const sheet = await getCardsSheet();
  const rows = await sheet.getRows();
  // Delete in reverse order to avoid index shifting
  const toDelete = rows.filter((r) => ids.includes(r.get("id"))).reverse();
  for (const row of toDelete) await row.delete();
}

// ── Comments Sheet ───────────────────────────────────────────

const COMMENT_HEADERS = ["id", "cardId", "author", "text", "time"];

async function getCommentsSheet() {
  const doc = await getDoc();
  let sheet = doc.sheetsByTitle["Comments"];
  if (!sheet) {
    sheet = await doc.addSheet({ title: "Comments", headerValues: COMMENT_HEADERS });
  }
  return sheet;
}

async function getAllComments(): Promise<Comment[]> {
  const sheet = await getCommentsSheet();
  const rows = await sheet.getRows();
  return rows.map((row) => ({
    id: row.get("id"),
    cardId: row.get("cardId"),
    author: row.get("author"),
    text: row.get("text"),
    time: row.get("time"),
  }));
}

export async function addComment(comment: Comment): Promise<Comment> {
  const sheet = await getCommentsSheet();
  await sheet.addRow({
    id: comment.id,
    cardId: comment.cardId,
    author: comment.author,
    text: comment.text,
    time: comment.time,
  });
  return comment;
}

// ── Seed ─────────────────────────────────────────────────────

export async function clearAndSeedCards(cards: Omit<ContentCard, "comments">[]): Promise<void> {
  const sheet = await getCardsSheet();
  const existingRows = await sheet.getRows();
  const seedIds = new Set(cards.map(c => c.id));

  // Save custom cards (not part of original seed) before clearing
  const customRows = existingRows
    .filter(row => !seedIds.has(row.get("id")))
    .map(row => ({
      id: row.get("id"),
      title: row.get("title"),
      description: row.get("description"),
      products: row.get("products"),
      platforms: row.get("platforms"),
      pillar: row.get("pillar"),
      funnel: row.get("funnel"),
      priority: row.get("priority"),
      optimization: row.get("optimization"),
      status: row.get("status"),
      createdAt: row.get("createdAt"),
      updatedAt: row.get("updatedAt"),
    }));

  // Delete all rows in reverse order to avoid index shifting
  for (const row of [...existingRows].reverse()) await row.delete();

  // Add seed rows first (c001–c050)
  const seedRows = cards.map((card) => ({
    id: card.id,
    title: card.title,
    description: card.description,
    products: card.products.join("||"),
    platforms: card.platforms.join("||"),
    pillar: card.pillar,
    funnel: card.funnel,
    priority: card.priority,
    optimization: card.optimization,
    status: card.status,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
  }));
  await sheet.addRows(seedRows);

  // Then re-append custom cards after (c051, c052, ...)
  if (customRows.length > 0) await sheet.addRows(customRows);
}

export async function getNextCardId(): Promise<string> {
  const sheet = await getCardsSheet();
  const rows = await sheet.getRows();
  let max = 0;
  for (const row of rows) {
    const id = row.get("id") || "";
    const match = id.match(/^c(\d+)$/);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return `c${String(max + 1).padStart(3, "0")}`;
}
