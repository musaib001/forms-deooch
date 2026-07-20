import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createMcpServer } from "@/lib/mcp/server";
import { resolveActor } from "@/lib/mcp/auth";

// Browser-based MCP clients (ChatGPT, Claude web) call this cross-origin, so
// the browser sends a preflight OPTIONS request before POST. Without these
// headers on every response the preflight fails and the client never gets to
// the real request.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, mcp-session-id, mcp-protocol-version, Last-Event-ID",
  "Access-Control-Expose-Headers": "mcp-session-id, mcp-protocol-version",
};

function withCors(response: Response) {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

async function handle(request: Request) {
  const actor = await resolveActor(request);
  if (!actor) {
    const resourceMetadataUrl = `${process.env.NEXT_PUBLIC_APP_URL}/.well-known/oauth-protected-resource`;
    return withCors(
      Response.json(
        { error: "Unauthorized" },
        { status: 401, headers: { "WWW-Authenticate": `Bearer resource_metadata="${resourceMetadataUrl}"` } }
      )
    );
  }

  const server = createMcpServer(actor);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);
  return withCors(await transport.handleRequest(request));
}

function handleOptions() {
  return withCors(new Response(null, { status: 204 }));
}

export { handle as GET, handle as POST, handle as DELETE, handleOptions as OPTIONS };
