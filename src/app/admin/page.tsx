"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { audioUrl, supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type Enums = Database["public"]["Enums"];
const IDIOMAS: Enums["lingo_language"][] = ["EN", "FR", "IT", "PT", "DE"];
const NIVELES: Enums["lingo_cefr_level"][] = ["A1", "A2", "B1", "B2"];
const HASTA_B1 = ["IT", "PT", "DE"];
const TIPOS: Record<Enums["lingo_exercise_type"], string> = {
  MULTIPLE_CHOICE: "Opción múltiple",
  FILL_BLANK: "Completar",
  LISTENING: "Escucha",
};

type Ej = {
  type: Enums["lingo_exercise_type"];
  question: string;
  options: string; // one per line
  correct_answer: string;
  audio_url: string | null;
  audio: "vacio" | "subiendo" | "listo" | "error";
};
const nuevoEj = (): Ej => ({ type: "MULTIPLE_CHOICE", question: "", options: "", correct_answer: "", audio_url: null, audio: "vacio" });

const input = "w-full rounded-xl border-2 border-neutral-200 p-3 text-base";

export default function AdminPage() {
  const [esAdmin, setEsAdmin] = useState<boolean | null>(null);
  const [mod, setMod] = useState({ language: "FR", cefr_level: "A1", class_topic: "", title: "" });
  const [ejs, setEjs] = useState<Ej[]>([nuevoEj()]);
  const [envio, setEnvio] = useState<{ tipo: "idle" | "enviando" } | { tipo: "ok"; id: string } | { tipo: "error"; msg: string }>({ tipo: "idle" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEsAdmin(data.session?.user.app_metadata.role === "admin"));
  }, []);

  const editar = (i: number, cambios: Partial<Ej>) =>
    setEjs((prev) => prev.map((e, j) => (j === i ? { ...e, ...cambios } : e)));

  const subirAudio = async (i: number, file: File) => {
    editar(i, { audio: "subiendo", audio_url: null });
    const path = `${crypto.randomUUID()}.${file.name.split(".").pop()?.toLowerCase()}`;
    const { error } = await supabase.storage.from("lingo_audios").upload(path, file, { contentType: file.type });
    editar(i, error ? { audio: "error" } : { audio: "listo", audio_url: path });
  };

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setEnvio({ tipo: "enviando" });
    const { data } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/modulos", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token}` },
      body: JSON.stringify({
        ...mod,
        exercises: ejs.map((e) => ({
          type: e.type,
          question: e.question.trim(),
          options: e.type === "FILL_BLANK" ? [] : e.options.split("\n").map((o) => o.trim()).filter(Boolean),
          correct_answer: e.correct_answer.trim(),
          audio_url: e.type === "LISTENING" ? e.audio_url : null,
        })),
      }),
    }).catch(() => null);
    const body = await res?.json().catch(() => ({}));
    if (res?.ok) {
      setEnvio({ tipo: "ok", id: body.id });
      setMod((m) => ({ ...m, class_topic: "", title: "" }));
      setEjs([nuevoEj()]);
    } else {
      setEnvio({ tipo: "error", msg: body?.error ?? "Error de red" });
    }
  };

  if (esAdmin === null) return null;
  if (!esAdmin) return <p className="p-4 pt-8 text-center text-neutral-500">Acceso solo para profesores.</p>;

  const subiendo = ejs.some((e) => e.audio === "subiendo");

  return (
    <form onSubmit={guardar} className="flex flex-col gap-4 p-4 pt-8">
      <h1 className="text-2xl font-bold">Nuevo módulo</h1>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Idioma
          <select
            className={input}
            value={mod.language}
            onChange={(e) => {
              const language = e.target.value;
              setMod((m) => ({ ...m, language, cefr_level: HASTA_B1.includes(language) && m.cefr_level === "B2" ? "B1" : m.cefr_level }));
            }}
          >
            {IDIOMAS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Nivel
          <select className={input} value={mod.cefr_level} onChange={(e) => setMod((m) => ({ ...m, cefr_level: e.target.value }))}>
            {NIVELES.map((n) => (
              <option key={n} disabled={n === "B2" && HASTA_B1.includes(mod.language)}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Tema de la clase
        <input required className={input} placeholder="Passé Composé con Être" value={mod.class_topic}
          onChange={(e) => setMod((m) => ({ ...m, class_topic: e.target.value }))} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Título
        <input required className={input} value={mod.title} onChange={(e) => setMod((m) => ({ ...m, title: e.target.value }))} />
      </label>

      {ejs.map((ej, i) => (
        <fieldset key={i} className="flex flex-col gap-3 rounded-2xl border-2 border-neutral-200 p-4">
          <legend className="px-1 font-bold">Ejercicio {i + 1}</legend>
          <select aria-label="Tipo" className={input} value={ej.type} onChange={(e) => editar(i, { type: e.target.value as Ej["type"] })}>
            {Object.entries(TIPOS).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
          <input required aria-label="Pregunta" className={input} value={ej.question} onChange={(e) => editar(i, { question: e.target.value })}
            placeholder={ej.type === "FILL_BLANK" ? "Je ___ allé au cinéma. (usa ___ para cada espacio)" : "Pregunta"} />

          {ej.type === "LISTENING" && (
            <div className="flex flex-col gap-2">
              <input required={!ej.audio_url} type="file" aria-label="Audio (MP3/WAV)" accept="audio/mpeg,audio/wav,.mp3,.wav"
                onChange={(e) => e.target.files?.[0] && subirAudio(i, e.target.files[0])} />
              {ej.audio === "subiendo" && <p className="text-sm text-neutral-500">Subiendo audio…</p>}
              {ej.audio === "error" && <p className="text-sm text-red-600">No se pudo subir (MP3/WAV, máx. 10 MB).</p>}
              {ej.audio_url && <audio controls src={audioUrl(ej.audio_url)} className="w-full" />}
            </div>
          )}

          {ej.type !== "FILL_BLANK" && (
            <textarea required aria-label="Opciones" rows={4} className={input} placeholder="Una opción por línea"
              value={ej.options} onChange={(e) => editar(i, { options: e.target.value })} />
          )}
          <input required aria-label="Respuesta correcta" className={input} value={ej.correct_answer}
            onChange={(e) => editar(i, { correct_answer: e.target.value })}
            placeholder={ej.type === "FILL_BLANK" ? "suis|allé (separa con | si hay varios espacios)" : "Respuesta correcta (igual a una opción)"} />
          {ejs.length > 1 && (
            <button type="button" className="self-start text-sm text-red-600" onClick={() => setEjs((p) => p.filter((_, j) => j !== i))}>
              Quitar ejercicio
            </button>
          )}
        </fieldset>
      ))}

      <button type="button" onClick={() => setEjs((p) => [...p, nuevoEj()])}
        className="min-h-12 rounded-2xl border-2 border-dashed border-neutral-300 p-3 font-semibold text-neutral-600">
        + Añadir ejercicio
      </button>

      <div role="status">
        {envio.tipo === "error" && <p className="text-red-600">{envio.msg}</p>}
        {envio.tipo === "ok" && (
          <p className="text-green-700">
            Módulo creado. <Link className="underline" href={`/leccion/${envio.id}`}>Probar lección</Link>
          </p>
        )}
      </div>

      <button disabled={subiendo || envio.tipo === "enviando"}
        className="sticky bottom-4 min-h-14 rounded-2xl bg-green-500 p-4 text-lg font-bold text-white disabled:bg-neutral-300">
        {envio.tipo === "enviando" ? "Guardando…" : "Crear módulo"}
      </button>
    </form>
  );
}
