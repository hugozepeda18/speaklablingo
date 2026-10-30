"use client";

import { useState } from "react";
import type { ExerciseProps } from "./types";

export function Opciones({ exercise, onChange, disabled }: ExerciseProps) {
  const [elegida, setElegida] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {(exercise.options as string[]).map((op) => (
        <button
          key={op}
          disabled={disabled}
          aria-pressed={elegida === op}
          onClick={() => {
            setElegida(op);
            onChange(op);
          }}
          className={`min-h-14 rounded-2xl border-2 p-4 text-left text-lg font-semibold ${
            elegida === op ? "border-sky-400 bg-sky-50 text-sky-700" : "border-neutral-200"
          }`}
        >
          {op}
        </button>
      ))}
    </div>
  );
}

export default function MultipleChoiceExercise(props: ExerciseProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">{props.exercise.question}</h2>
      <Opciones {...props} />
    </div>
  );
}
