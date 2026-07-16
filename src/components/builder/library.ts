import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  Calculator,
  Calendar,
  CheckSquare,
  ChevronDown,
  CircleDot,
  CreditCard,
  EyeOff,
  GitBranch,
  Hash,
  Heading,
  HeartHandshake,
  Mail,
  Paperclip,
  Phone,
  Repeat,
  Type,
} from "lucide-react";
import type { FieldType } from "@/lib/forms/schema";

export type LibraryItem = {
  /** Real field type, or a slug for coming-soon items */
  type: FieldType | string;
  name: string;
  description: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

export type LibraryCategory = { name: string; items: LibraryItem[] };

export const LIBRARY: LibraryCategory[] = [
  {
    name: "Basic",
    items: [
      { type: "text", name: "Short Text", description: "Single line input", icon: Type },
      { type: "textarea", name: "Long Text", description: "Multi-line answer", icon: AlignLeft },
      { type: "number", name: "Number", description: "Numeric input", icon: Hash },
      { type: "date", name: "Date", description: "Date picker", icon: Calendar },
    ],
  },
  {
    name: "Contact",
    items: [
      { type: "email", name: "Email", description: "Validated email", icon: Mail },
      { type: "phone", name: "Phone", description: "Phone number", icon: Phone },
    ],
  },
  {
    name: "Choice",
    items: [
      { type: "select", name: "Dropdown", description: "Pick one from a list", icon: ChevronDown },
      { type: "radio", name: "Single Choice", description: "Radio buttons", icon: CircleDot },
      { type: "checkbox", name: "Multiple Choice", description: "Check all that apply", icon: CheckSquare },
    ],
  },
  {
    name: "Layout & Media",
    items: [
      { type: "heading", name: "Section Heading", description: "Group fields visually", icon: Heading },
      { type: "file", name: "File Link", description: "Link to an upload", icon: Paperclip },
    ],
  },
  {
    name: "Payments",
    items: [
      { type: "payment-product", name: "Product", description: "Sell a single item", icon: CreditCard, comingSoon: true },
      { type: "payment-subscription", name: "Subscription", description: "Recurring billing", icon: Repeat, comingSoon: true },
      { type: "payment-donation", name: "Donation", description: "Pay-what-you-want", icon: HeartHandshake, comingSoon: true },
    ],
  },
  {
    name: "Advanced",
    items: [
      { type: "adv-hidden", name: "Hidden Field", description: "Invisible metadata", icon: EyeOff, comingSoon: true },
      { type: "adv-calc", name: "Calculation", description: "Computed values", icon: Calculator, comingSoon: true },
      { type: "adv-logic", name: "Conditional Logic", description: "Show/hide by answers", icon: GitBranch, comingSoon: true },
    ],
  },
];

export const ITEM_BY_TYPE: Record<string, LibraryItem> = Object.fromEntries(
  LIBRARY.flatMap((c) => c.items).map((i) => [i.type, i])
);
