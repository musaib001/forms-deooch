import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";
import { TopBar } from "@/components/portal/TopBar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getSessionProfile();
  if (!profile) redirect(`/login?_debug=${process.env.DEV_BYPASS_AUTH ?? "undef"}`);

  return (
    // h-screen + min-h-0 (not min-h-screen) so a full-bleed child can claim the
    // exact remaining viewport height and scroll internally.
    <div className="flex h-screen flex-col">
      <TopBar
        email={profile.email}
        fullName={profile.full_name}
        role={profile.role}
        plan={profile.plan}
      />
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
