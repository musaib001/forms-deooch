import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// cache() dedupes per request: portal layout + page + API guards all call
// this, so without it every navigation pays 2+ extra Supabase round trips.
export const getSessionProfile = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role, plan")
    .eq("id", user.id)
    .single();

  return profile;
});
