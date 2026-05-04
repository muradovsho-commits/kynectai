import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, data } = body;
    if (!userId || !data) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await convex.mutation(api.progress.saveProgress, { userId, data });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Progress save error:", err);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
