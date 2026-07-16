import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";
import { MembersTable } from "@/components/settings/MembersTable";
import { Container } from "@/components/portal/Container";

export default async function MembersPage() {
  const profile = await getSessionProfile();
  if (profile?.role !== "owner") redirect("/dashboard");

  return (
    <Container>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Members
      </h1>
      <p className="mb-6 mt-0.5 text-sm text-muted-foreground">
        Invite teammates by their Google email. They can build and edit forms.
      </p>
      <MembersTable />
    </Container>
  );
}
