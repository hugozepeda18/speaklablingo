begin;
select plan(11);

select has_table('LingoModule');
select has_table('LingoExercise');
select has_table('StudentLingoProgress');
select has_table('LingoCompletionLog');
select ok((select bool_and(relrowsecurity) from pg_class where relname in
  ('LingoModule','LingoExercise','StudentLingoProgress','LingoCompletionLog')), 'RLS on all Lingo tables');
select ok(exists(select 1 from storage.buckets where id = 'lingo_audios' and public), 'lingo_audios bucket is public');

select throws_ok($$insert into "LingoModule"(language,cefr_level,class_topic,title) values ('IT','B2','t','t')$$,
  '23514', null, 'IT/PT/DE capped at B1');

-- seed: one module + two students
insert into "LingoModule"(id,language,cefr_level,class_topic,title)
  values ('00000000-0000-0000-0000-0000000000aa','FR','B2','Passé Composé','PC');
insert into auth.users(id) values ('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002');
insert into "StudentProfile"(id) values ('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002');
insert into "StudentLingoProgress"(student_id,total_xp) values ('00000000-0000-0000-0000-000000000001',10),('00000000-0000-0000-0000-000000000002',20);

set local role anon;
select ok(exists(select 1 from "LingoModule" where id = '00000000-0000-0000-0000-0000000000aa'), 'anon reads modules');

set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000001"}';
select results_eq($$select total_xp from "StudentLingoProgress"$$, array[10], 'student sees only own progress');
select throws_ok($$insert into "LingoCompletionLog"(student_id,module_id) values ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000aa')$$,
  '42501', null, 'student cannot write log directly');
update "StudentLingoProgress" set total_xp = 9999;
reset role;
select is((select total_xp from "StudentLingoProgress" where student_id='00000000-0000-0000-0000-000000000001'), 10, 'student cannot bump own xp');

select * from finish();
rollback;
