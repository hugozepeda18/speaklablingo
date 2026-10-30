"use client";

import { Fragment, useState } from "react";
import type { ExerciseProps } from "./types";

// question marks blanks with "___"; with several blanks, correct_answer joins them with "|".
export default function FillBlankExercise({ exercise, onChange, disabled }: ExerciseProps) {
  const partes = exercise.question.split("___");
  const [valores, setValores] = useState<string[]>(() => Array(partes.length - 1).fill(""));

  const escribir = (i: number, v: string) => {
    const next = valores.map((x, j) => (j === i ? v : x));
    setValores(next);
    onChange(next.some((x) => !x.trim()) ? "" : next.map((x) => x.trim()).join("|"));
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-neutral-500">Completa la frase</h2>
      <p className="text-2xl font-bold leading-loose">
        {partes.map((parte, i) => (
          <Fragment key={i}>
            {parte}
            {i < valores.length && (
              <input
                value={valores[i]}
                onChange={(e) => escribir(i, e.target.value)}
                disabled={disabled}
                aria-label={`Espacio ${i + 1}`}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                className="mx-1 w-28 border-b-4 border-sky-400 bg-transparent text-center text-sky-700 outline-none"
              />
            )}
          </Fragment>
        ))}
      </p>
    </div>
  );
}
