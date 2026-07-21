import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import { POSTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing about AI form building, MCP connectors, and getting responses out of an AI assistant and into a spreadsheet.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Blog
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          Notes on AI form building, the Model Context Protocol, and connecting
          the assistant you already use to the forms you already need.
        </p>

        <ul className="mt-10 divide-y divide-border border-t border-border">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block py-6">
                {post.date && (
                  <time
                    dateTime={post.date}
                    className="text-sm text-muted-foreground"
                  >
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </time>
                )}
                <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground group-hover:text-brand">
                  {post.title}
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PublicShell>
  );
}
