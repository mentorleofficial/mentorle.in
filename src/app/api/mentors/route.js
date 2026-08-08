import { NextResponse } from "next/server";
import { fetchPublicMentors } from "@/lib/mentors";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const badge = searchParams.get("badge");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : null;

    const mentors = await fetchPublicMentors({
      badge: badge || null,
      limit: Number.isFinite(limit) && limit > 0 ? limit : null,
    });

    return NextResponse.json({ data: mentors });
  } catch (error) {
    console.error("GET /api/mentors error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch mentors" },
      { status: 500 }
    );
  }
}
