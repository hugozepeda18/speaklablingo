import type { Database } from "@/types/supabase";
// Service role: the only writer of StudentLingoProgress / LingoCompletionLog (see RLS migration).
import { admin, usuarioDe } from "@/lib/supabaseAdmin";

export type CompletarResponse = Database["public"]["Functions"]["complete_lingo_module"]["Returns"][number];

// POST /api/modulos/:id/completar  { completionId: uuid, timeZone: "America/Mexico_City" }
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await usuarioDe(req);
  if (!user) return Response.json({ error: "No autenticado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  let hoy: string;
  try {
    // ponytail: trusts the client's time zone; spoofing it gains at most one day of streak.
    hoy = new Intl.DateTimeFormat("en-CA", { timeZone: body.timeZone }).format(new Date()); // YYYY-MM-DD
  } catch {
    return Response.json({ error: "timeZone inválido" }, { status: 400 });
  }

  const { data, error } = await admin
    .rpc("complete_lingo_module", {
      p_completion_id: body.completionId,
      p_student_id: user.id,
      p_module_id: params.id,
      p_today: hoy,
    })
    .single();

  if (error) {
    if (error.code === "22P02") return Response.json({ error: "id inválido" }, { status: 400 });
    if (error.code === "P0002") return Response.json({ error: "Módulo no encontrado" }, { status: 404 });
    if (error.code === "23503") return Response.json({ error: "Perfil de alumno no encontrado" }, { status: 404 });
    console.error("complete_lingo_module", error);
    return Response.json({ error: "Error al guardar el progreso" }, { status: 500 });
  }
  return Response.json(data);
}
