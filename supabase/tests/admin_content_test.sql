begin;
select plan(8);

create function pg_temp.mod(ex jsonb, lang text default 'FR', lvl text default 'A1') returns uuid language sql as $$
  select create_lingo_module(jsonb_build_object('language', lang, 'cefr_level', lvl, 'class_topic', 't', 'title', 't', 'exercises', ex)) $$;

select ok(pg_temp.mod('[{"type":"MULTIPLE_CHOICE","question":"q","options":["a","b"],"correct_answer":"a","audio_url":null},
                         {"type":"FILL_BLANK","question":"Je ___ ___.","options":[],"correct_answer":"suis|allé","audio_url":null}]') is not null,
  'valid module is created');
select is((select count(*)::int from "LingoExercise" e join "LingoModule" m on m.id = e.module_id where m.class_topic = 't'), 2, 'exercises inserted');
select throws_ok($$select pg_temp.mod('[{"type":"MULTIPLE_CHOICE","question":"q","options":["a"],"correct_answer":"z","audio_url":null}]')$$,
  '22023', null, 'MC answer must be one of the options');
select throws_ok($$select pg_temp.mod('[{"type":"FILL_BLANK","question":"Je ___ ___.","options":[],"correct_answer":"suis","audio_url":null}]')$$,
  '22023', null, 'blank count must match answers');
select throws_ok($$select pg_temp.mod('[{"type":"LISTENING","question":"q","options":["a"],"correct_answer":"a","audio_url":null}]')$$,
  '23514', null, 'LISTENING needs audio');
select throws_ok($$select pg_temp.mod('[{"type":"MULTIPLE_CHOICE","question":"q","options":["a"],"correct_answer":"a","audio_url":null}]', 'IT', 'B2')$$,
  '23514', null, 'IT capped at B1, and nothing is half-inserted');

set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000001","app_metadata":{"role":"admin"}}';
select lives_ok($$insert into storage.objects (bucket_id, name) values ('lingo_audios', 'x/admin.wav')$$, 'admin can upload audio');
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000002","app_metadata":{}}';
select throws_ok($$insert into storage.objects (bucket_id, name) values ('lingo_audios', 'x/student.wav')$$,
  '42501', null, 'students cannot upload audio');

select * from finish();
rollback;
