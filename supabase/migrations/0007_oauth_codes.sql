-- Short-lived authorization codes for the MCP OAuth flow (RFC 6749 + PKCE).
-- Redeeming a code mints a normal api_tokens row, so resolveActor() needs no changes.

create table public.oauth_codes (
  code text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  redirect_uri text not null,
  code_challenge text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

-- No policies: only the admin (service-role) client touches this table,
-- from the /authorize and /token route handlers.
alter table public.oauth_codes enable row level security;
