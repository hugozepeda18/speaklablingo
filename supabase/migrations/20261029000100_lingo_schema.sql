create type lingo_language as enum ('EN', 'FR', 'IT', 'PT', 'DE');
create type lingo_cefr_level as enum ('A1', 'A2', 'B1', 'B2');
create type lingo_exercise_type as enum ('MULTIPLE_CHOICE', 'FILL_BLANK', 'LISTENING');

create table "LingoModule" (
  id uuid primary key default gen_random_uuid(),
  language lingo_language not null,
  cefr_level lingo_cefr_level not null,
  class_topic text not null,
  title text not null,
  -- IT, PT, DE are capped at B1
  constraint lingo_module_level_cap check (language in ('EN', 'FR') or cefr_level <> 'B2')
);

create table "LingoExercise" (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references "LingoModule" (id) on delete cascade,
  type lingo_exercise_type not null,
  question text not null,
  options jsonb not null default '[]' check (jsonb_typeof(options) = 'array'),
  correct_answer text not null,
  audio_url text,
  constraint lingo_exercise_listening_audio check (type <> 'LISTENING' or audio_url is not null)
);
create index on "LingoExercise" (module_id);

create table "StudentLingoProgress" (
  student_id uuid primary key references "StudentProfile" (id) on delete cascade,
  total_xp int not null default 0 check (total_xp >= 0),
  current_streak int not null default 0 check (current_streak >= 0),
  last_practice_date date
);

create table "LingoCompletionLog" (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references "StudentProfile" (id) on delete cascade,
  module_id uuid not null references "LingoModule" (id) on delete cascade,
  completed_at timestamptz not null default now()
);
create index on "LingoCompletionLog" (student_id, completed_at desc);

-- RLS: content is publicly readable; students read only their own progress/log.
alter table "LingoModule" enable row level security;
alter table "LingoExercise" enable row level security;
alter table "StudentLingoProgress" enable row level security;
alter table "LingoCompletionLog" enable row level security;

create policy "modules are public" on "LingoModule" for select to anon, authenticated using (true);
create policy "exercises are public" on "LingoExercise" for select to anon, authenticated using (true);

create policy "students read own progress" on "StudentLingoProgress"
  for select to authenticated using (student_id = (select auth.uid()));
create policy "students read own log" on "LingoCompletionLog"
  for select to authenticated using (student_id = (select auth.uid()));

-- ponytail: no client write policies on purpose. XP/streak writes happen server-side
-- (Phase 4 Route Handler with service role), so a student can't PATCH their own total_xp.
-- Content writes (Phase 5 admin) also go through the service role.
