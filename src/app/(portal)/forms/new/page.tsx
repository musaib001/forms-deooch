import Link from "next/link";
import { FormStudio } from "@/components/builder/FormStudio";
import { getSessionProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { FREE_FORM_LIMIT } from "@/lib/forms/limits";
import { buttonPrimaryClass } from "@/lib/ui";
import { Container } from "@/components/portal/Container";

export default async function NewFormPage() {
  const profile = await getSessionProfile();

  if (profile?.role === "free") {
    const supabase = await createClient();
    const { count } = await supabase
      .from("forms")
      .select("id", { count: "exact", head: true })
      .eq("created_by", profile.id);

    if ((count ?? 0) >= FREE_FORM_LIMIT) {
      return (
        <Container>
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <p className="text-base font-semibold text-foreground">
              Form limit reached
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Free accounts are limited to {FREE_FORM_LIMIT} forms. Delete an
              existing form to create a new one.
            </p>
            <Link href="/dashboard" className={buttonPrimaryClass + " mt-5"}>
              Back to forms
            </Link>
          </div>
        </Container>
      );
    }
  }

  return (
    <Container>
      <FormStudio />
    </Container>
  );
}
