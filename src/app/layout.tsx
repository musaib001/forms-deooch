import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// One brand string, used everywhere. "Deooch Forms" over "deoochform": it
// matches the domain, the MCP Registry entry, and how people actually type it.
// alternateName below keeps the old spelling resolving to the same entity.
const BRAND = "Deooch Forms";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} — AI form builder with an MCP connector`,
    template: `%s — ${BRAND}`,
  },
  description:
    "Build forms by describing them to Claude, ChatGPT, or any MCP assistant — or by hand in the studio. Share a public link, collect responses in one place, export to Excel. Free plan, no card.",
  applicationName: BRAND,
  keywords: [
    "AI form builder",
    "AI form MCP connector",
    "MCP server for forms",
    "form builder MCP",
    "create forms with AI",
    "Claude form builder",
    "online forms",
    "survey builder",
  ],
  alternates: { canonical: "/" },
  // Search Console ownership, for the HTML-tag verification method. Unset is
  // fine — the tag just isn't rendered. Skip this entirely if you verify
  // deooch.com as a DNS domain property instead, which covers every subdomain.
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  openGraph: {
    type: "website",
    siteName: BRAND,
    url: SITE_URL,
    title: `${BRAND} — AI form builder with an MCP connector`,
    description:
      "Describe a form in plain English and it builds itself. Collect responses in one place and export to Excel.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND} — AI form builder with an MCP connector`,
    description:
      "Describe a form in plain English and it builds itself. Collect responses in one place and export to Excel.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND,
      alternateName: ["deoochform", "deooch forms", "deooch-forms"],
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      sameAs: ["https://github.com/musaib001"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: BRAND,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Extensions (Grammarly et al) inject data-* onto body before hydration. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
