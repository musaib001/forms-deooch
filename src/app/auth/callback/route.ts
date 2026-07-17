import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Where to land after the session is established. Password recovery routes
  // here with next=/auth/reset; everything else defaults to the dashboard.
  const nextParam = searchParams.get("next");
  const next = nextParam?.startsWith("/") ? nextParam : "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=signin_failed`);
  }

  const supabase = await createClient();
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login?error=signin_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.redirect(`${origin}/login?error=signin_failed`);
  }

  const admin = createAdminClient();

  // Google returns full_name; the email signup form writes the same key via
  // signUp options.data. Null when neither supplied one — TopBar falls back
  // to email.
  const fullName: string | null =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? null;

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    const isOwner =
      user.email.toLowerCase() === process.env.OWNER_EMAIL?.toLowerCase();

    if (isOwner) {
      await admin
        .from("profiles")
        .insert({ id: user.id, email: user.email, role: "owner", full_name: fullName });
    } else {
      // Trusted members are promoted via an owner invite. Anyone else who
      // signs in with Google gets a capped, self-scoped 'free' account.
      const { data: invite } = await admin
        .from("invites")
        .select("id, accepted")
        .eq("email", user.email)
        .maybeSingle();

      if (invite && !invite.accepted) {
        await admin
          .from("profiles")
          .insert({ id: user.id, email: user.email, role: "member", full_name: fullName });
        await admin.from("invites").update({ accepted: true }).eq("id", invite.id);
      } else {
        await admin
          .from("profiles")
          .insert({ id: user.id, email: user.email, role: "free", full_name: fullName });
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
