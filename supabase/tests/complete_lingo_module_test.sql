begin;
select plan(9);

insert into "LingoModule"(id,language,cefr_level,class_topic,title) values ('00000000-0000-0000-0000-0000000000aa','FR','A1','t','t');
insert into "LingoExercise"(module_id,type,question,correct_answer) values
  ('00000000-0000-0000-0000-0000000000aa','FILL_BLANK','q','a'), ('00000000-0000-0000-0000-0000000000aa','FILL_BLANK','q','b');
insert into auth.users(id) values ('00000000-0000-0000-0000-000000000001');
insert into "StudentProfile"(id) values ('00000000-0000-0000-0000-000000000001');

create function pg_temp.c(cid int, d date) returns record language sql as $$
  select (x.xp_ganada, x.total_xp, x.streak_anterior, x.current_streak)
  from complete_lingo_module(('00000000-0000-0000-0000-' || lpad(cid::text, 12, '0'))::uuid,
    '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000aa', d) x $$;

select is(pg_temp.c(1, '2026-01-10')::text, '(20,20,0,1)', 'first completion: 2 exercises = 20 XP, streak 1');
select is(pg_temp.c(1, '2026-01-10')::text, '(0,20,1,1)', 'same completion id again: idempotent');
select is(pg_temp.c(2, '2026-01-10')::text, '(20,40,1,1)', 'same day: XP only, streak unchanged');
select is(pg_temp.c(3, '2026-01-11')::text, '(20,60,1,2)', 'next day: streak +1');
select is(pg_temp.c(4, '2026-01-12')::text, '(20,80,2,3)', 'next day again: streak +1');
select is(pg_temp.c(5, '2026-01-14')::text, '(20,100,3,1)', 'skipped a day: streak resets to 1');
select is((select count(*)::int from "LingoCompletionLog"), 5, 'one log row per distinct completion');
select throws_ok($$select pg_temp.c(6, '2026-01-15') from (select set_config('role','authenticated',true)) s$$,
  '42501', null, 'students cannot call it directly');
reset role;
select throws_ok($$select complete_lingo_module(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', gen_random_uuid(), '2026-01-15')$$,
  'P0002', null, 'unknown module -> P0002');

select * from finish();
rollback;
