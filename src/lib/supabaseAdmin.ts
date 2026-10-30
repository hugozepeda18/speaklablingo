import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Service role: server-only (Route Handlers). Bypasses RLS, so every caller must authorize first.
export const admin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

export async function usuarioDe(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token) return null;
  const { data } = await admin.auth.getUser(token);
  return data.user;
}
