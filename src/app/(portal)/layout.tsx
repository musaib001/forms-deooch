import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";
import { TopBar } from "@/components/portal/TopBar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getSessionProfile();
  if (!profile) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar email={profile.email} role={profile.role} plan={profile.plan} />
      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
