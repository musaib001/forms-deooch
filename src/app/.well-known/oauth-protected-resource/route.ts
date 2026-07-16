import { NextResponse } from "next/server";

export async function GET() {
  const origin = process.env.NEXT_PUBLIC_APP_URL!;
  return NextResponse.json({
    resource: `${origin}/api/mcp`,
    authorization_servers: [origin],
  });
}
