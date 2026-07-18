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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "deoochform — AI-native form builder",
    template: "%s — deoochform",
  },
  description:
    "Create forms by describing them in plain English to your AI assistant, or build them by hand. Collect responses in one place and export to Excel.",
  applicationName: "deoochform",
  keywords: [
    "AI form builder",
    "form builder",
    "MCP forms",
    "create forms with AI",
    "online forms",
    "survey builder",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "deoochform",
    url: SITE_URL,
    title: "deoochform — AI-native form builder",
    description:
      "Describe a form in plain English and it builds itself. Collect responses in one place and export to Excel.",
  },
  twitter: {
    card: "summary_large_image",
    title: "deoochform — AI-native form builder",
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
      name: "deoochform",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "deoochform",
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
