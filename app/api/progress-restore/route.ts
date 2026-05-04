import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const result = await convex.query(api.progress.loadProgress, { userId });
    if (!result) {
      return NextResponse.json({ data: null });
    }
    return NextResponse.json({ data: result.data });
  } catch (err: any) {
    console.error("Progress restore error:", err);
    return NextResponse.json({ data: null });
  }
}
