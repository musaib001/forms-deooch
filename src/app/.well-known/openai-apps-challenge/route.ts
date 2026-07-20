// Domain verification for the ChatGPT app directory. The submission portal
// generates the token when you submit and pings this path on the bare
// domain immediately, so it must already be live before you click submit.
// Response must be exactly the token: plain text, no JSON, no extra content.
export const dynamic = "force-static";

export function GET() {
  const token = process.env.OPENAI_APPS_VERIFICATION_TOKEN;
  if (!token) return new Response("Not found", { status: 404 });
  return new Response(token, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
