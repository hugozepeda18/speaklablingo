-- ponytail: StudentProfile is owned by SpeakLab (shared DB). This stub only exists so the
-- local stack has an FK target; it's a no-op where SpeakLab already created the table.
-- Assumes StudentProfile.id = auth.users.id (RLS below relies on auth.uid() = student_id).
create table if not exists "StudentProfile" (
  id uuid primary key references auth.users (id) on delete cascade
);
alter table "StudentProfile" enable row level security;
