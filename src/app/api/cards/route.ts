import { NextRequest, NextResponse } from "next/server";
import { getAllCards, addCard, updateCard, deleteCard, bulkUpdateStatus, bulkDelete } from "@/lib/sheets";
import { v4 as uuid } from "uuid";

export async function GET() {
  try {
    const cards = await getAllCards();
    return NextResponse.json({ cards });
  } catch (err: any) {
    console.error("GET /api/cards error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Bulk operations
    if (body.action === "bulk_keep") {
      if (!Array.isArray(body.ids) || body.ids.length === 0)
        return NextResponse.json({ error: "ids must be a non-empty array" }, { status: 400 });
      await bulkUpdateStatus(body.ids, "drafting");
      return NextResponse.json({ ok: true });
    }
    if (body.action === "bulk_reject") {
      if (!Array.isArray(body.ids) || body.ids.length === 0)
        return NextResponse.json({ error: "ids must be a non-empty array" }, { status: 400 });
      await bulkDelete(body.ids);
      return NextResponse.json({ ok: true });
    }

    // Single card add — use uuid to avoid sequential-ID race condition
    const now = new Date().toISOString();
    const card = await addCard({
      id: uuid().slice(0, 8),
      title: body.title || "",
      description: body.description || "",
      products: body.products || [],
      platforms: body.platforms || [],
      pillar: body.pillar || "",
      funnel: body.funnel || "",
      priority: body.priority || "🟡 Medium",
      optimization: body.optimization || "",
      status: body.status || "idea",
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ card });
  } catch (err: any) {
    console.error("POST /api/cards error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    if (!body.updates || typeof body.updates !== "object")
      return NextResponse.json({ error: "Missing updates" }, { status: 400 });
    await updateCard(body.id, body.updates);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.message?.includes("not found")) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error("PATCH /api/cards error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await deleteCard(id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("DELETE /api/cards error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
