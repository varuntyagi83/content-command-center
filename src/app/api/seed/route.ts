import { NextResponse } from "next/server";
import { clearAndSeedCards } from "@/lib/sheets";
import { SEED_IDEAS } from "@/lib/seed-data";

export async function POST() {
  try {
    await clearAndSeedCards(SEED_IDEAS);
    return NextResponse.json({ ok: true, seeded: SEED_IDEAS.length });
  } catch (err: any) {
    console.error("POST /api/seed error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
