import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createMcpServer } from "@/lib/mcp/server";
import { resolveActor } from "@/lib/mcp/auth";

async function handle(request: Request) {
  const actor = await resolveActor(request);
  if (!actor) {
    const resourceMetadataUrl = `${process.env.NEXT_PUBLIC_APP_URL}/.well-known/oauth-protected-resource`;
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "WWW-Authenticate": `Bearer resource_metadata="${resourceMetadataUrl}"` } }
    );
  }

  const server = createMcpServer(actor);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);
  return transport.handleRequest(request);
}

export { handle as GET, handle as POST, handle as DELETE };
