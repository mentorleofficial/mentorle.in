import { NextResponse } from "next/server";
import { fetchPublicMentorByParam } from "@/lib/mentors";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const resolved = await params;
    const id = resolved?.id;

    if (!id) {
      return NextResponse.json({ error: "Missing mentor id" }, { status: 400 });
    }

    const mentor = await fetchPublicMentorByParam(id);

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    return NextResponse.json({ data: mentor });
  } catch (error) {
    console.error("GET /api/mentors/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch mentor" },
      { status: 500 }
    );
  }
}
