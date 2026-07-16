import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";

type Params = { params: Promise<{ formId: string; submissionId: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { formId, submissionId } = await params;
  const supabase = await createClient();

  // Scope by form_id too: a submission id alone must not be deletable out of
  // the context of the form the caller is actually looking at.
  const { error } = await supabase
    .from("submissions")
    .delete()
    .eq("id", submissionId)
    .eq("form_id", formId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
