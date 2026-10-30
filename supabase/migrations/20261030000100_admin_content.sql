-- Admins are users with app_metadata.role = 'admin' (only settable with the service role).
create function public.is_lingo_admin() returns boolean language sql stable as $$
  select coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin', false)
$$;

-- Teachers upload audio straight from the browser; everyone reads via the public URL.
create policy "admins upload lingo audio" on storage.objects
  for insert to authenticated with check (bucket_id = 'lingo_audios' and public.is_lingo_admin());

-- Creates a module + its exercises atomically from the same JSON the OpenAI schema produces
-- (src/lib/lingoModuleSchema.ts). Enum casts, NOT NULL and CHECK constraints do most of the validation.
create function public.create_lingo_module(p jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_bad text;
begin
  if jsonb_typeof(p -> 'exercises') is distinct from 'array' or jsonb_array_length(p -> 'exercises') = 0 then
    raise exception 'exercises must be a non-empty array' using errcode = '22023';
  end if;

  select e ->> 'question' into v_bad from jsonb_array_elements(p -> 'exercises') e
  where (e ->> 'type' in ('MULTIPLE_CHOICE', 'LISTENING') and not coalesce((e -> 'options') ? (e ->> 'correct_answer'), false))
     or (e ->> 'type' = 'FILL_BLANK' and
         (length(e ->> 'question') - length(replace(e ->> 'question', '___', ''))) / 3
           <> cardinality(string_to_array(e ->> 'correct_answer', '|')))
  limit 1;
  if found then
    raise exception 'correct_answer does not match options/blanks in: %', v_bad using errcode = '22023';
  end if;

  insert into public."LingoModule" (language, cefr_level, class_topic, title)
  values ((p ->> 'language')::public.lingo_language, (p ->> 'cefr_level')::public.lingo_cefr_level,
          p ->> 'class_topic', p ->> 'title')
  returning id into v_id;

  insert into public."LingoExercise" (module_id, type, question, options, correct_answer, audio_url)
  select v_id, (e ->> 'type')::public.lingo_exercise_type, e ->> 'question',
         coalesce(e -> 'options', '[]'), e ->> 'correct_answer', e ->> 'audio_url'
  from jsonb_array_elements(p -> 'exercises') e;

  return v_id;
end $$;

revoke execute on function public.create_lingo_module from public, anon, authenticated;
grant execute on function public.create_lingo_module to service_role;
