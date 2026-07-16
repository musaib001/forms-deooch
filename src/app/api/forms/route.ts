import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";
import { createFormSchema } from "@/lib/forms/schema";
import { newFormSlug } from "@/lib/forms/slug";
import { quotaFor } from "@/lib/plans";

export async function GET() {
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forms")
    .select("id, slug, title, status, created_at, submissions(count)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ forms: data });
}

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = createFormSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();

  const quota = quotaFor(profile);
  if (quota.formLimit !== null) {
    const { count } = await supabase
      .from("forms")
      .select("id", { count: "exact", head: true })
      .eq("created_by", profile.id);
    if ((count ?? 0) >= quota.formLimit) {
      return NextResponse.json(
        { error: `Your plan is limited to ${quota.formLimit} forms. Upgrade to create more.` },
        { status: 403 }
      );
    }
  }

  const { data, error } = await supabase
    .from("forms")
    .insert({
      slug: newFormSlug(),
      title: body.data.title,
      description: body.data.description,
      fields: body.data.fields,
      created_by: profile.id,
      updated_by: profile.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ form: data }, { status: 201 });
}
