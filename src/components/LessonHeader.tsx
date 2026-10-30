"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LessonHeader({ progress }: { progress: number }) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: p } = await supabase
        .from("StudentLingoProgress")
        .select("current_streak")
        .eq("student_id", data.user.id)
        .maybeSingle();
      setStreak(p?.current_streak ?? 0);
    });
  }, []);

  return (
    <header className="flex items-center gap-3 p-4">
      <Link href="/" aria-label="Salir de la lección" className="p-2 text-2xl text-neutral-400">
        ✕
      </Link>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="h-4 flex-1 overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className="h-full rounded-full bg-green-500 transition-[width] duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="font-bold text-orange-500" aria-label={`Racha de ${streak} días`}>
        🔥 {streak}
      </span>
    </header>
  );
}
