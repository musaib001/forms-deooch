import { getSessionProfile } from "@/lib/auth/session";
import { TopBar } from "@/components/portal/TopBar";
import { MarketingNav, MarketingFooter } from "@/components/marketing/MarketingNav";

// Chrome for the public pages (/templates, /docs, /blog): they're indexable and
// reachable signed-out, but also linked from the portal nav, so they can't
// commit to one chrome. Signed-out visitors get the marketing nav, signed-in
// users get the app's own top bar instead of a "Sign up free" button they
// already have.
export async function PublicShell({ children }: { children: React.ReactNode }) {
  const profile = await getSessionProfile();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {profile ? (
        <TopBar
          email={profile.email}
          fullName={profile.full_name}
          role={profile.role}
          plan={profile.plan}
        />
      ) : (
        <MarketingNav />
      )}
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
