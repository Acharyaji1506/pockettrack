import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSessionFromRequest } from "@/lib/getSession";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("user_id", session.userId)
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ categories: data });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const { name } = await req.json();
  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Category name can't be empty." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert({ user_id: session.userId, name: name.trim(), is_default: false })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ category: data });
}
