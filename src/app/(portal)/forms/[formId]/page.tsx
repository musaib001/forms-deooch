import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormStudio } from "@/components/builder/FormStudio";
import { Container } from "@/components/portal/Container";

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const supabase = await createClient();
  const { data: form } = await supabase
    .from("forms")
    .select("*")
    .eq("id", formId)
    .single();

  if (!form) notFound();

  return (
    <Container>
      <FormStudio existing={form} />
    </Container>
  );
}
