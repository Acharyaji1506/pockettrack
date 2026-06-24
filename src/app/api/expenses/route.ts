import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSessionFromRequest } from "@/lib/getSession";

// Quietly drops anything older than 365 days for this user, every time they load data.
// Keeps the table light without needing a separate scheduled job.
async function pruneOldExpenses(userId: string) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 365);
  await supabaseAdmin
    .from("expenses")
    .delete()
    .eq("user_id", userId)
    .lt("spent_on", cutoff.toISOString().slice(0, 10));
}

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  await pruneOldExpenses(session.userId);

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // format: YYYY-MM

  let query = supabaseAdmin
    .from("expenses")
    .select("*, categories(name)")
    .eq("user_id", session.userId)
    .order("spent_on", { ascending: true });

  if (month) {
    const start = `${month}-01`;
    const end = new Date(month + "-01");
    end.setMonth(end.getMonth() + 1);
    query = query.gte("spent_on", start).lt("spent_on", end.toISOString().slice(0, 10));
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ expenses: data });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const { amount, categoryId, note, spentOn } = await req.json();

  if (!amount || Number(amount) <= 0) {
    return NextResponse.json({ error: "Enter a valid amount." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("expenses")
    .insert({
      user_id: session.userId,
      category_id: categoryId || null,
      amount: Number(amount),
      note: note || null,
      spent_on: spentOn || new Date().toISOString().slice(0, 10),
    })
    .select("*, categories(name)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ expense: data });
}
