-- The submissions table had select + public insert policies but no delete
-- policy, so RLS silently blocked every delete (0 rows affected, no error).
-- Mirror the 0004 select scoping: trusted roles team-wide, free users only on
-- forms they own.

create policy submissions_trusted_delete on public.submissions for delete
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('owner', 'member')
  ));

create policy submissions_free_own_delete on public.submissions for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'free')
    and exists (
      select 1 from public.forms f
      where f.id = submissions.form_id and f.created_by = auth.uid()
    )
  );
