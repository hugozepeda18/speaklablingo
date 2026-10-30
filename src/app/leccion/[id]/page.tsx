import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Lesson from "@/components/Lesson";

export const dynamic = "force-dynamic";

export default async function LeccionPage({ params }: { params: { id: string } }) {
  const { data: exercises, error } = await supabase
    .from("LingoExercise")
    .select("*")
    .eq("module_id", params.id);
  if (error) throw error;
  if (!exercises.length) notFound();

  return <Lesson exercises={exercises} />;
}
