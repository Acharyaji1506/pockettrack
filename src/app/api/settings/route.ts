import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSessionFromRequest } from "@/lib/getSession";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("reminder_time, daily_budget")
    .eq("id", session.userId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PATCH(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const { reminderTime, dailyBudget } = await req.json();

  const updates: Record<string, unknown> = {};
  if (reminderTime) updates.reminder_time = reminderTime;
  if (dailyBudget !== undefined) updates.daily_budget = Number(dailyBudget) || 0;

  const { error } = await supabaseAdmin
    .from("users")
    .update(updates)
    .eq("id", session.userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
