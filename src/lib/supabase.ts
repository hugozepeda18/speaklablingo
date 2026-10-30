import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// audio_url stores the path inside the bucket, so the same rows work locally and in prod.
export const audioUrl = (path: string) =>
  supabase.storage.from("lingo_audios").getPublicUrl(path).data.publicUrl;
