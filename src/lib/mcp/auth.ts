import { createAdminClient } from "@/lib/supabase/admin";
import { hashToken } from "@/lib/auth/pat";

export type McpActor = { id: string; email: string; role: string; plan: string };

export async function resolveActor(request: Request): Promise<McpActor | null> {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;

  const raw = auth.slice("Bearer ".length).trim();
  const admin = createAdminClient();

  const { data: token } = await admin
    .from("api_tokens")
    .select("id, user_id, revoked_at, profiles(id, email, role, plan)")
    .eq("token_hash", hashToken(raw))
    .is("revoked_at", null)
    .maybeSingle();

  if (!token) return null;

  admin
    .from("api_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", token.id)
    .then(() => {});

  const profile = Array.isArray(token.profiles) ? token.profiles[0] : token.profiles;
  if (!profile) return null;

  return profile as McpActor;
}
