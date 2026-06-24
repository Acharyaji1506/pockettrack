import { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";

export function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}
