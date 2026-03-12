import { NextRequest, NextResponse } from "next/server";
import { clearAndSeedCards } from "@/lib/sheets";
import { SEED_IDEAS } from "@/lib/seed-data";

export async function POST(req: NextRequest) {
  const secret = process.env.SEED_SECRET;
  if (secret) {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("secret") !== secret) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  try {
    await clearAndSeedCards(SEED_IDEAS);
    return NextResponse.json({ ok: true, seeded: SEED_IDEAS.length });
  } catch (err: any) {
    console.error("POST /api/seed error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
