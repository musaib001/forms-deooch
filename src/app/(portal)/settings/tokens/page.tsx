import { TokensTable } from "@/components/settings/TokensTable";
import { Container } from "@/components/portal/Container";

export default function TokensPage() {
  return (
    <Container>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        API Tokens
      </h1>
      <p className="mb-6 mt-0.5 text-sm text-muted-foreground">
        Connect Claude or GPT to this workspace via MCP at{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          {`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/mcp`}
        </code>
        .
      </p>
      <TokensTable />
    </Container>
  );
}
