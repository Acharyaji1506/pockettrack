import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { signSession, sessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are both required." },
      { status: 400 }
    );
  }

  const cleanUsername = username.trim().toLowerCase();

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("username", cleanUsername)
    .maybeSingle();

  if (!user) {
    return NextResponse.json(
      { error: "No account found with that username." },
      { status: 404 }
    );
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json(
      { error: "Wrong password. Try again." },
      { status: 401 }
    );
  }

  const token = signSession({ userId: user.id, username: user.username });
  const res = NextResponse.json({ username: user.username });
  res.headers.set("Set-Cookie", sessionCookie(token));
  return res;
}
