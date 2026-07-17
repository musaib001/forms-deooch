import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// ponytail: dev-only escape hatch for testing the portal UI without a real
// login loop. Double-gated (NODE_ENV check + explicit opt-in env var) so it
// can never fire in a production build even if the env var leaks somewhere.
const DEV_BYPASS =
  process.env.NODE_ENV !== "production" && process.env.DEV_BYPASS_AUTH === "true";

const DEV_PROFILE = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "dev@localhost",
  full_name: "Dev User",
  role: "owner",
  plan: "gold",
};

// cache() dedupes per request: portal layout + page + API guards all call
// this, so without it every navigation pays 2+ extra Supabase round trips.
export const getSessionProfile = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return DEV_BYPASS ? DEV_PROFILE : null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role, plan, full_name")
    .eq("id", user.id)
    .single();

  return profile ?? (DEV_BYPASS ? DEV_PROFILE : null);
});
