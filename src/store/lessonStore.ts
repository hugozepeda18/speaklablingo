import { create } from "zustand";
import type { Tables } from "@/types/supabase";

export type Exercise = Tables<"LingoExercise">;

// ponytail: flat XP per exercise, client-side display only; the Phase 4 route recomputes the real XP.
export const XP_POR_EJERCICIO = 10;

type LessonState = {
  ejerciciosPendientes: Exercise[]; // ejercicioActual is always ejerciciosPendientes[0]
  ejercicioActual: Exercise | null;
  xpAcumulada: number;
  iniciarLeccion: (ejercicios: Exercise[]) => void;
  responder: (respuesta: string) => boolean;
};

// Case/whitespace-insensitive, but accents count (é ≠ e is part of what's being learned).
const normalizar = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

export const useLessonStore = create<LessonState>((set, get) => ({
  ejerciciosPendientes: [],
  ejercicioActual: null,
  xpAcumulada: 0,

  iniciarLeccion: (ejercicios) =>
    set({ ejerciciosPendientes: ejercicios, ejercicioActual: ejercicios[0] ?? null, xpAcumulada: 0 }),

  // No lives: a wrong answer just sends the exercise to the back of the queue.
  responder: (respuesta) => {
    const [actual, ...resto] = get().ejerciciosPendientes;
    if (!actual) return false;

    const correcta = normalizar(respuesta) === normalizar(actual.correct_answer);
    if (!correcta) resto.push(actual);

    set((s) => ({
      ejerciciosPendientes: resto,
      ejercicioActual: resto[0] ?? null,
      xpAcumulada: s.xpAcumulada + (correcta ? XP_POR_EJERCICIO : 0),
    }));
    return correcta;
  },
}));
