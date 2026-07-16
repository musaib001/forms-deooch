import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPkce } from "@/lib/mcp/oauth";
import { generateToken } from "@/lib/auth/pat";

async function readParams(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return new URLSearchParams(await request.json());
  return new URLSearchParams(await request.text());
}

export async function POST(request: Request) {
  const params = await readParams(request);
  if (params.get("grant_type") !== "authorization_code") {
    return NextResponse.json({ error: "unsupported_grant_type" }, { status: 400 });
  }

  const code = params.get("code");
  const redirectUri = params.get("redirect_uri");
  const codeVerifier = params.get("code_verifier");
  if (!code || !redirectUri || !codeVerifier) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: authCode } = await admin
    .from("oauth_codes")
    .select("user_id, redirect_uri, code_challenge, expires_at, used_at")
    .eq("code", code)
    .maybeSingle();

  if (
    !authCode ||
    authCode.used_at ||
    authCode.redirect_uri !== redirectUri ||
    new Date(authCode.expires_at) < new Date() ||
    !verifyPkce(codeVerifier, authCode.code_challenge)
  ) {
    return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
  }

  await admin.from("oauth_codes").update({ used_at: new Date().toISOString() }).eq("code", code);

  const { raw, hash } = generateToken();
  const { error } = await admin
    .from("api_tokens")
    .insert({ user_id: authCode.user_id, name: "Claude Connector", token_hash: hash });
  if (error) {
    return NextResponse.json({ error: "server_error", error_description: error.message }, { status: 500 });
  }

  return NextResponse.json({ access_token: raw, token_type: "bearer" });
}
