import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/getSession";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({ user: { username: session.username } });
}
