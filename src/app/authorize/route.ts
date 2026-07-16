import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateAuthCode, codeExpiry } from "@/lib/mcp/oauth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams } = url;

  const responseType = searchParams.get("response_type");
  const redirectUri = searchParams.get("redirect_uri");
  const codeChallenge = searchParams.get("code_challenge");
  const codeChallengeMethod = searchParams.get("code_challenge_method");
  const state = searchParams.get("state");

  if (!redirectUri || responseType !== "code" || !codeChallenge) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Missing response_type, redirect_uri, or code_challenge." },
      { status: 400 }
    );
  }
  if (codeChallengeMethod !== "S256") {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Only code_challenge_method=S256 is supported." },
      { status: 400 }
    );
  }

  const profile = await getSessionProfile();
  if (!profile) {
    const next = `${url.pathname}${url.search}`;
    return NextResponse.redirect(`${url.origin}/login?next=${encodeURIComponent(next)}`);
  }

  const code = generateAuthCode();
  const admin = createAdminClient();
  const { error } = await admin.from("oauth_codes").insert({
    code,
    user_id: profile.id,
    redirect_uri: redirectUri,
    code_challenge: codeChallenge,
    expires_at: codeExpiry(),
  });
  if (error) {
    return NextResponse.json({ error: "server_error", error_description: error.message }, { status: 500 });
  }

  const redirectTo = new URL(redirectUri);
  redirectTo.searchParams.set("code", code);
  if (state) redirectTo.searchParams.set("state", state);
  return NextResponse.redirect(redirectTo.toString());
}
