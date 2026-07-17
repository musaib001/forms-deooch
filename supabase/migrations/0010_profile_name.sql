-- Nullable: existing rows predate the signup name field and fall back to email.
alter table public.profiles add column full_name text;
