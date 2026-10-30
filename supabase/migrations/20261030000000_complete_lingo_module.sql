-- Atomic module completion: XP + streak + log in one transaction.
-- p_completion_id is a client-generated idempotency key, so a retried request never double-counts.
-- p_today is the student's local date (computed by the Route Handler from their time zone).
create function public.complete_lingo_module(
  p_completion_id uuid, p_student_id uuid, p_module_id uuid, p_today date
)
returns table (xp_ganada int, total_xp int, streak_anterior int, current_streak int)
language plpgsql security definer set search_path = '' as $$
declare
  v_xp int;
  v_prev_streak int;
begin
  -- Keep in sync with XP_POR_EJERCICIO in src/store/lessonStore.ts.
  select count(*) * 10 into v_xp from public."LingoExercise" where module_id = p_module_id;
  if v_xp = 0 then
    raise exception 'module % not found or empty', p_module_id using errcode = 'P0002';
  end if;

  insert into public."LingoCompletionLog" (id, student_id, module_id)
  values (p_completion_id, p_student_id, p_module_id)
  on conflict (id) do nothing;

  if not found then -- already processed: report current state, award nothing
    return query select 0, p.total_xp, p.current_streak, p.current_streak
      from public."StudentLingoProgress" p where p.student_id = p_student_id;
    return;
  end if;

  insert into public."StudentLingoProgress" (student_id) values (p_student_id)
  on conflict (student_id) do nothing;

  select p.current_streak into v_prev_streak
    from public."StudentLingoProgress" p where p.student_id = p_student_id for update;

  return query
  update public."StudentLingoProgress" p set
    total_xp = p.total_xp + v_xp,
    current_streak = case
      when p.last_practice_date >= p_today then greatest(p.current_streak, 1) -- same day: XP only
      when p.last_practice_date = p_today - 1 then p.current_streak + 1       -- yesterday: +1
      else 1                                                                  -- gap >= 2 days or first time
    end,
    last_practice_date = greatest(p.last_practice_date, p_today)
  where p.student_id = p_student_id
  returning v_xp, p.total_xp, v_prev_streak, p.current_streak;
end $$;

revoke execute on function public.complete_lingo_module from public, anon, authenticated;
grant execute on function public.complete_lingo_module to service_role;
