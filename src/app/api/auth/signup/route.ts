import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { signSession, sessionCookie } from "@/lib/auth";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are both required." },
      { status: 400 }
    );
  }
  if (username.length < 3) {
    return NextResponse.json(
      { error: "Username needs at least 3 characters." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password needs at least 6 characters." },
      { status: 400 }
    );
  }

  const cleanUsername = username.trim().toLowerCase();

  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("username", cleanUsername)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "That username is already taken." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .insert({ username: cleanUsername, password_hash: passwordHash })
    .select()
    .single();

  if (error || !user) {
    return NextResponse.json(
      { error: "Could not create the account. Try again." },
      { status: 500 }
    );
  }

  await supabaseAdmin.from("categories").insert(
    DEFAULT_CATEGORIES.map((name) => ({
      user_id: user.id,
      name,
      is_default: true,
    }))
  );

  const token = signSession({ userId: user.id, username: user.username });
  const res = NextResponse.json({ username: user.username });
  res.headers.set("Set-Cookie", sessionCookie(token));
  return res;
}
