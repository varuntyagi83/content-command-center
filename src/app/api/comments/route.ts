import { NextRequest, NextResponse } from "next/server";
import { addComment, deleteComment } from "@/lib/sheets";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const comment = await addComment({
      id: uuid().slice(0, 8),
      cardId: body.cardId,
      author: body.author,
      text: body.text,
      time: new Date().toISOString(),
    });
    return NextResponse.json({ comment });
  } catch (err: any) {
    console.error("POST /api/comments error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await deleteComment(id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("DELETE /api/comments error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
