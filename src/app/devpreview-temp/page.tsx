"use client";

import { PublicFormRenderer } from "@/components/forms/PublicFormRenderer";
import type { Field } from "@/lib/forms/schema";

const fields: Field[] = [
  { id: "1", type: "text", label: "Hospital's Name", required: true, order: 0 },
  { id: "2", type: "text", label: "Your Name", required: false, order: 1 },
  { id: "3", type: "phone", label: "Contact Number", required: false, order: 2 },
  { id: "4", type: "heading", label: "Facility Profile", required: false, order: 3 },
  {
    id: "5",
    type: "radio",
    label: "What type of healthcare facility do you work in?",
    required: true,
    options: ["Private Hospital", "Specialty Hospital", "Clinic"],
    order: 4,
  },
  { id: "6", type: "heading", label: "Pilot and Contact Consent", required: false, order: 5 },
  {
    id: "7",
    type: "radio",
    label: "Would you be open to a pilot program?",
    required: true,
    options: ["Yes", "Maybe", "No"],
    order: 6,
  },
];

export default function DevPreviewPage() {
  return (
    <PublicFormRenderer
      formId="preview"
      slug="preview"
      title="Deooch Hospital AI Readiness Assessment"
      description="Learn more about Deooch: https://www.deooch.com/"
      fields={fields}
      preview
    />
  );
}
