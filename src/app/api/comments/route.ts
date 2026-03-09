import { NextRequest, NextResponse } from "next/server";
import { addComment } from "@/lib/sheets";
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
