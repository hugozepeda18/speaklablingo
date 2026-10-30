-- Public bucket: files are readable via public URL without a policy.
-- Uploads go through the service role (Phase 5 admin), so no insert policy here.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lingo_audios', 'lingo_audios', true, 10485760,
        array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/wave'])
on conflict (id) do nothing;
