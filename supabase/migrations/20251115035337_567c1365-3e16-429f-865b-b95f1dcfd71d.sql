-- One-time admin bootstrap function: first account becomes admin
create or replace function public.bootstrap_first_admin(_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned boolean := false;
begin
  -- If there are no admins yet, promote this user to admin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (_user_id, 'admin');
    assigned := true;
  end if;
  return assigned;
end;
$$;

-- Optional: Recreate comment for clarity
comment on function public.bootstrap_first_admin is 'Promotes the given user to admin if no admin exists yet. Returns true if assigned.';