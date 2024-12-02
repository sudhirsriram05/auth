-- Enable PostgREST API
create schema api;
grant usage on schema api to postgres, anon, authenticated;

-- Enable GraphQL API
create extension if not exists "postgraphile_watch";

-- Create admin_profiles table
create table public.admin_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  role text not null default 'ADMIN',
  last_login timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table public.admin_profiles enable row level security;

create policy "Admin profiles are viewable by admin users only" 
  on public.admin_profiles for select 
  using (auth.role() = 'authenticated' and exists (
    select 1 from public.admin_profiles where id = auth.uid()
  ));

-- Create function to handle new admin registration
create or replace function public.handle_new_admin()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.admin_profiles (id, email, role)
  values (new.id, new.email, 'ADMIN');
  return new;
end;
$$;

-- Create trigger for new admin registration
create trigger on_auth_admin_created
  after insert on auth.users
  for each row
  when (new.email = 'admin@bgremoval.in')
  execute procedure public.handle_new_admin();