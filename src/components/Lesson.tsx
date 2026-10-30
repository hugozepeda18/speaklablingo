"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLessonStore, type Exercise } from "@/store/lessonStore";
import LessonHeader from "./LessonHeader";
import MultipleChoiceExercise from "./exercises/MultipleChoiceExercise";
import FillBlankExercise from "./exercises/FillBlankExercise";
import ListeningExercise from "./exercises/ListeningExercise";

const COMPONENTES = {
  MULTIPLE_CHOICE: MultipleChoiceExercise,
  FILL_BLANK: FillBlankExercise,
  LISTENING: ListeningExercise,
};

export default function Lesson({ exercises }: { exercises: Exercise[] }) {
  const { ejerciciosPendientes, ejercicioActual, xpAcumulada, iniciarLeccion, responder } = useLessonStore();
  const [listo, setListo] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  const [intento, setIntento] = useState(0); // remounts the exercise so a requeued one starts clean
  // The store advances on responder(); keep the answered exercise on screen until "Continuar".
  const [feedback, setFeedback] = useState<{ exercise: Exercise; correcta: boolean } | null>(null);

  useEffect(() => {
    iniciarLeccion(exercises);
    setListo(true);
  }, [exercises, iniciarLeccion]);

  if (!listo) return null;

  const progreso = 1 - ejerciciosPendientes.length / exercises.length;
  const mostrado = feedback?.exercise ?? ejercicioActual;

  // ponytail: placeholder end screen; Phase 4 replaces it with the real Success screen.
  if (!mostrado) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
        <p className="text-6xl">🎉</p>
        <h1 className="text-3xl font-bold">¡Lección completada!</h1>
        <p className="text-xl font-semibold text-orange-500">+{xpAcumulada} XP</p>
        <Link href="/" className="mt-8 w-full rounded-2xl bg-green-500 p-4 text-lg font-bold text-white">
          Volver
        </Link>
      </div>
    );
  }

  const Ejercicio = COMPONENTES[mostrado.type];

  const comprobar = () => {
    const actual = ejercicioActual!;
    setFeedback({ exercise: actual, correcta: responder(respuesta) });
  };

  const continuar = () => {
    setFeedback(null);
    setRespuesta("");
    setIntento((i) => i + 1);
  };

  return (
    <div className="flex flex-1 flex-col">
      <LessonHeader progress={progreso} />

      <section className="flex-1 p-4">
        <Ejercicio key={intento} exercise={mostrado} onChange={setRespuesta} disabled={!!feedback} />
      </section>

      {/* Thumb zone: the only action button lives at the bottom. */}
      <footer
        className={`sticky bottom-0 flex flex-col gap-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] ${
          feedback ? (feedback.correcta ? "bg-green-100" : "bg-red-100") : "bg-white"
        }`}
      >
        {feedback && (
          <div role="status" className={feedback.correcta ? "text-green-700" : "text-red-700"}>
            <p className="text-xl font-bold">{feedback.correcta ? "¡Correcto!" : "Casi…"}</p>
            {!feedback.correcta && (
              <p>
                Respuesta: <b>{feedback.exercise.correct_answer.split("|").join(", ")}</b>. Volverá al final.
              </p>
            )}
          </div>
        )}
        <button
          onClick={feedback ? continuar : comprobar}
          disabled={!feedback && !respuesta}
          className={`min-h-14 rounded-2xl p-4 text-lg font-bold text-white disabled:bg-neutral-300 ${
            feedback && !feedback.correcta ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {feedback ? "Continuar" : "Comprobar"}
        </button>
      </footer>
    </div>
  );
}
