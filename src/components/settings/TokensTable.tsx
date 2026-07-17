"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/date";

type Token = {
  id: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
};

export function TokensTable() {
  const [tokens, setTokens] = useState<Token[]>([]);

  async function load() {
    const res = await fetch("/api/tokens");
    const data = await res.json();
    setTokens(data.tokens ?? []);
  }

  useEffect(() => {
    let ignore = false;
    fetch("/api/tokens")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setTokens(data.tokens ?? []);
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function revoke(id: string) {
    await fetch(`/api/tokens/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {tokens.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          No connected apps yet. Add the MCP URL above in Claude or GPT — you&apos;ll
          be sent here to sign in, then back automatically.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">App</th>
                <th className="px-4 py-3 font-semibold">Connected</th>
                <th className="px-4 py-3 font-semibold">Last used</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {tokens.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {t.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(t.created_at)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {t.last_used_at ? formatDate(t.last_used_at) : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium " +
                        (t.revoked_at
                          ? "bg-muted text-muted-foreground"
                          : "bg-brand-subtle text-brand")
                      }
                    >
                      {t.revoked_at ? "Revoked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!t.revoked_at && (
                      <button
                        onClick={() => revoke(t.id)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
