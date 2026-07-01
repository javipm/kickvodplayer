create table video_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id text not null,
  progress numeric not null,
  created_at timestamptz not null default now(),
  primary key (user_id, video_id)
);

create table follow (
  user_id uuid not null references auth.users(id) on delete cascade,
  streamer text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, streamer)
);

alter table video_progress enable row level security;
alter table follow enable row level security;

create policy "users manage own progress" on video_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage own follows" on follow
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
