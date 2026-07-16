-- Pricing plan per profile. Defaults to 'free'; Stripe webhooks will update
-- this when subscriptions go live. Quota definitions live in src/lib/plans.ts.

alter table public.profiles
  add column plan text not null default 'free'
  check (plan in ('free','bronze','silver','gold','platinum','enterprise'));
