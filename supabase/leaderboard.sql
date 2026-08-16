-- Run this in Supabase Dashboard > SQL Editor to show ALL users on the leaderboard

-- 1) Allow authenticated users to read all profiles/stats (if not already applied)
drop policy if exists "profiles_select_leaderboard" on public.profiles;
create policy "profiles_select_leaderboard"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "user_stats_select_leaderboard" on public.user_stats;
create policy "user_stats_select_leaderboard"
on public.user_stats for select
to authenticated
using (true);

-- 2) Backfill missing profile + stats rows for existing auth users
insert into public.profiles (id, name, email)
select
  u.id,
  coalesce(
    nullif(trim(u.raw_user_meta_data->>'name'), ''),
    nullif(trim(u.raw_user_meta_data->>'full_name'), ''),
    split_part(u.email, '@', 1)
  ),
  u.email
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

insert into public.user_stats (user_id, stats)
select u.id, '{}'::jsonb
from auth.users u
left join public.user_stats us on us.user_id = u.id
where us.user_id is null
on conflict (user_id) do nothing;

-- 3) Secure leaderboard function (reads ALL auth users)
create or replace function public.get_leaderboard()
returns table (
  id uuid,
  name text,
  email text,
  avatar_url text,
  xp bigint
)
language sql
security definer
set search_path = ''
stable
as $$
  select
    u.id,
    coalesce(
      nullif(trim(p.name), ''),
      nullif(trim(u.raw_user_meta_data->>'name'), ''),
      nullif(trim(u.raw_user_meta_data->>'full_name'), ''),
      nullif(split_part(u.email, '@', 1), ''),
      'Player'
    ) as name,
    u.email,
    p.avatar_url,
    coalesce(
      nullif((us.stats->>'totalXp')::bigint, 0),
      (
        select coalesce(sum(gs.score), 0)::bigint
        from public.game_sessions gs
        where gs.user_id = u.id
      ),
      0::bigint
    ) as xp
  from auth.users u
  left join public.profiles p on p.id = u.id
  left join public.user_stats us on us.user_id = u.id
  order by xp desc, name asc;
$$;

revoke all on function public.get_leaderboard() from public;
grant execute on function public.get_leaderboard() to authenticated;

-- 4) Realtime (optional)
do $$
begin
  alter publication supabase_realtime add table public.profiles;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.user_stats;
exception
  when duplicate_object then null;
end $$;
