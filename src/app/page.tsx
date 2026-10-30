import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Enums } from "@/types/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  let query = supabase.from("LingoModule").select("id, title, class_topic, language, cefr_level");
  // DEMO_LANG=IT npm run dev → only that language's modules (for showcasing to a student)
  const lang = process.env.DEMO_LANG?.toUpperCase() as Enums<"lingo_language"> | undefined;
  if (lang) query = query.eq("language", lang);
  const { data: modules, error } = await query;
  if (error) throw error;

  return (
    <div className="flex flex-col gap-4 p-4 pt-8">
      <h1 className="text-2xl font-bold">Práctica diaria</h1>
      {modules.map((m) => (
        <Link
          key={m.id}
          href={`/leccion/${m.id}`}
          className="rounded-2xl border-2 border-neutral-200 p-4 active:bg-neutral-100"
        >
          <p className="text-sm font-semibold text-orange-600">
            {m.language} · {m.cefr_level}
          </p>
          <p className="text-lg font-bold">{m.title}</p>
          <p className="text-neutral-500">{m.class_topic}</p>
        </Link>
      ))}
    </div>
  );
}
