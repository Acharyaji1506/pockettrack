import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSessionFromRequest } from "@/lib/getSession";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
