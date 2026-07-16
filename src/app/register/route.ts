import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

// Minimal RFC 7591 dynamic client registration. We don't track clients — any
// redirect_uri is accepted at /authorize (PKCE is what actually authenticates
// the exchange), so this just hands back an id for the client to remember.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    client_id: "dfc_" + randomBytes(9).toString("base64url"),
    client_name: body.client_name ?? "MCP Client",
    redirect_uris: body.redirect_uris ?? [],
    grant_types: ["authorization_code"],
    response_types: ["code"],
    token_endpoint_auth_method: "none",
  });
}
