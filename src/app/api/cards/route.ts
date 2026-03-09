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
      await bulkUpdateStatus(body.ids, "drafting");
      return NextResponse.json({ ok: true });
    }
    if (body.action === "bulk_reject") {
      await bulkDelete(body.ids);
      return NextResponse.json({ ok: true });
    }

    // Single card add
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
    await updateCard(body.id, body.updates);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
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
