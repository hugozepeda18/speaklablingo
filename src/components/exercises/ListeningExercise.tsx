"use client";

import { useEffect, useRef, useState } from "react";
import { audioUrl } from "@/lib/supabase";
import { Opciones } from "./MultipleChoiceExercise";
import type { ExerciseProps } from "./types";

export default function ListeningExercise(props: ExerciseProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error">("cargando");

  // The SSR'd <audio> may load before hydration attaches onLoadedMetadata.
  useEffect(() => {
    if (audioRef.current && audioRef.current.readyState >= 1) setEstado("listo");
  }, []);

  const reproducir = () => {
    const audio = audioRef.current!;
    audio.currentTime = 0;
    audio.play().catch(() => setEstado("error"));
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">{props.exercise.question}</h2>
      {/* iOS Safari ignores preload="auto", so metadata is the earliest reliable "ready" signal. */}
      <audio
        ref={audioRef}
        src={audioUrl(props.exercise.audio_url!)}
        preload="auto"
        onLoadedMetadata={() => setEstado("listo")}
        onError={() => setEstado("error")}
      />
      <button
        onClick={reproducir}
        disabled={estado !== "listo"}
        aria-label={estado === "listo" ? "Reproducir audio" : estado === "cargando" ? "Cargando audio" : "Error al cargar el audio"}
        className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-sky-500 text-6xl text-white shadow-[0_6px_0_#0369a1] active:translate-y-1 active:shadow-none disabled:bg-neutral-300 disabled:shadow-none"
      >
        {estado === "cargando" ? <span className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" /> : estado === "error" ? "⚠️" : "🔊"}
      </button>
      {estado === "error" && <p className="text-center text-red-600">No se pudo cargar el audio.</p>}
      <Opciones {...props} />
    </div>
  );
}
