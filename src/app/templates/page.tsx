import type { Metadata } from "next";
import { PublicShell } from "@/components/marketing/PublicShell";
import { TemplateGallery } from "@/components/templates/TemplateGallery";

export const metadata: Metadata = {
  title: "Form templates",
  description:
    "Free form templates for contact, registration, feedback, applications, and consent. Preview one, then make it yours in a click.",
};

export default function TemplatesPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Form templates
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
            Start from something that already works. Preview any template, then
            edit every field to suit you.
          </p>
        </div>
        <TemplateGallery />
      </section>
    </PublicShell>
  );
}
