create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  avatar_url text,
  language text default 'en',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stats jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_sessions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text,
  game_type text not null,
  score integer not null default 0,
  accuracy numeric,
  difficulty text not null,
  reaction_time integer,
  max_level integer,
  timestamp bigint not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_feedback (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  message text,
  language text default 'en',
  page text default 'feedback',
  user_agent text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists user_stats_set_updated_at on public.user_stats;
create trigger user_stats_set_updated_at
before update on public.user_stats
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.email
  )
  on conflict (id) do update
  set email = excluded.email,
      name = coalesce(public.profiles.name, excluded.name),
      updated_at = now();

  insert into public.user_stats (user_id, stats)
  values (new.id, '{}'::jsonb)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public, anon, authenticated;

alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.game_sessions enable row level security;
alter table public.user_feedback enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.user_stats from anon, authenticated;
revoke all on table public.game_sessions from anon, authenticated;
revoke all on table public.user_feedback from anon, authenticated;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update on table public.user_stats to authenticated;
grant select, insert on table public.game_sessions to authenticated;
grant insert on table public.user_feedback to authenticated;
grant insert on table public.user_feedback to anon;
grant usage, select on sequence public.game_sessions_id_seq to authenticated;
grant usage, select on sequence public.user_feedback_id_seq to anon, authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "user_stats_select_own" on public.user_stats;
create policy "user_stats_select_own"
on public.user_stats for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "user_stats_insert_own" on public.user_stats;
create policy "user_stats_insert_own"
on public.user_stats for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "user_stats_update_own" on public.user_stats;
create policy "user_stats_update_own"
on public.user_stats for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "game_sessions_select_own" on public.game_sessions;
create policy "game_sessions_select_own"
on public.game_sessions for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "game_sessions_insert_own" on public.game_sessions;
create policy "game_sessions_insert_own"
on public.game_sessions for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "feedback_insert_own" on public.user_feedback;
create policy "feedback_insert_own"
on public.user_feedback for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "feedback_insert_anon" on public.user_feedback;
create policy "feedback_insert_anon"
on public.user_feedback for insert
to anon
with check (user_id is null);

create index if not exists game_sessions_user_timestamp_idx on public.game_sessions (user_id, timestamp desc);
create index if not exists user_feedback_user_created_idx on public.user_feedback (user_id, created_at desc);
