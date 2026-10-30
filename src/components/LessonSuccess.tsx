"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { CompletarResponse } from "@/app/api/modulos/[id]/completar/route";

type Estado =
  | { tipo: "guardando" }
  | { tipo: "ok"; r: CompletarResponse }
  | { tipo: "sin_sesion" }
  | { tipo: "error" };

export default function LessonSuccess({ moduleId, completionId, xpLocal }: {
  moduleId: string;
  completionId: string; // idempotency key: retries never double-count
  xpLocal: number;
}) {
  const [estado, setEstado] = useState<Estado>({ tipo: "guardando" });
  const enviado = useRef(false);

  const guardar = useCallback(async () => {
    setEstado({ tipo: "guardando" });
    const { data } = await supabase.auth.getSession();
    if (!data.session) return setEstado({ tipo: "sin_sesion" });
    try {
      const res = await fetch(`/api/modulos/${moduleId}/completar`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}` },
        body: JSON.stringify({ completionId, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setEstado({ tipo: "ok", r: await res.json() });
    } catch {
      setEstado({ tipo: "error" });
    }
  }, [moduleId, completionId]);

  useEffect(() => {
    if (enviado.current) return; // StrictMode runs effects twice in dev
    enviado.current = true;
    guardar();
  }, [guardar]);

  const r = estado.tipo === "ok" ? estado.r : null;
  const subioRacha = r && r.current_streak > r.streak_anterior;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4 text-center">
      <p className="text-7xl">🎉</p>
      <h1 className="text-3xl font-bold">¡Lección completada!</h1>

      <div className="grid w-full grid-cols-2 gap-3" role="status">
        <div className="rounded-2xl border-2 border-orange-300 p-4">
          <p className="text-sm font-bold text-orange-500">RACHA</p>
          <p className={`text-3xl font-bold ${subioRacha ? "animate-bounce" : ""}`}>
            🔥 {r ? r.current_streak : "–"}
          </p>
          {subioRacha && <p className="text-sm text-orange-600">+1 día</p>}
        </div>
        <div className="rounded-2xl border-2 border-yellow-300 p-4">
          <p className="text-sm font-bold text-yellow-600">XP GANADA</p>
          <p className="text-3xl font-bold">⚡ {r ? r.xp_ganada : xpLocal}</p>
          {r && <p className="text-sm text-neutral-500">Total: {r.total_xp}</p>}
        </div>
      </div>

      {estado.tipo === "guardando" && <p className="text-neutral-500">Guardando tu progreso…</p>}
      {estado.tipo === "sin_sesion" && (
        <p className="text-neutral-500">Inicia sesión en SpeakLab para guardar tu racha y XP.</p>
      )}

      <div className="mt-auto flex w-full flex-col gap-3 pb-[env(safe-area-inset-bottom)]">
        {estado.tipo === "error" && (
          <>
            <p className="text-red-600">No pudimos guardar tu progreso.</p>
            <button onClick={guardar} className="min-h-14 rounded-2xl bg-orange-500 p-4 text-lg font-bold text-white">
              Reintentar
            </button>
          </>
        )}
        <Link
          href="/"
          aria-disabled={estado.tipo === "guardando"}
          className={`min-h-14 rounded-2xl p-4 text-lg font-bold text-white ${
            estado.tipo === "guardando" ? "pointer-events-none bg-neutral-300" : "bg-green-500"
          }`}
        >
          Continuar
        </Link>
      </div>
    </div>
  );
}
