import type { Exercise } from "@/store/lessonStore";

export type ExerciseProps = {
  exercise: Exercise;
  onChange: (respuesta: string) => void; // "" means not answerable yet
  disabled: boolean;
};
