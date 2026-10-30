import { admin, usuarioDe } from "@/lib/supabaseAdmin";
import { LINGO_MODULE_SCHEMA } from "@/lib/lingoModuleSchema";

// GET: the payload schema (ready for OpenAI Structured Outputs).
export function GET() {
  return Response.json(LINGO_MODULE_SCHEMA);
}

// POST: create a module + exercises from that payload. Admins only.
export async function POST(req: Request) {
  const user = await usuarioDe(req);
  if (!user) return Response.json({ error: "No autenticado" }, { status: 401 });
  if (user.app_metadata.role !== "admin") return Response.json({ error: "Solo profesores" }, { status: 403 });

  const payload = await req.json().catch(() => null);
  if (!payload || typeof payload !== "object") return Response.json({ error: "JSON inválido" }, { status: 400 });

  const { data: id, error } = await admin.rpc("create_lingo_module", { p: payload });
  if (error) {
    // 22xxx: bad value/enum/JSON shape, 23xxx: NOT NULL / CHECK constraints — all caller errors.
    if (/^2[23]/.test(error.code)) return Response.json({ error: error.message }, { status: 400 });
    console.error("create_lingo_module", error);
    return Response.json({ error: "Error al crear el módulo" }, { status: 500 });
  }
  return Response.json({ id }, { status: 201 });
}
