# Agent Directives (`CLAUDE.md`)

## Reglas Operativas
* Trabaja iterativamente siguiendo `TASKS.md`.
* Todo el desarrollo frontend debe simular un viewport móvil (ej. iPhone Pro max dimensions).
* No implementes ningún sistema de "corazones" o "vidas". El usuario puede fallar infinitamente; el ejercicio simplemente se repite hasta que lo logre.

## Comandos y Herramientas
* **Desarrollo Local:** `npm run dev`
* **Base de datos Local:** `supabase start`
* **Generación de Tipos:** `supabase gen types typescript --local > src/types/supabase.ts`

## Estándares de Código
* **Ejercicios de Escucha:** Usa el tag de HTML5 `<audio>` controlado mediante React refs para reproducir el `audio_url` de Supabase Storage. Asegúrate de manejar estados de carga (loading) antes de permitir la reproducción.
* **Estado de la Lección:** Usa `Zustand` para encolar los ejercicios. Si el alumno falla, haz un `.push()` del ejercicio actual al final del array del estado para que lo vuelva a intentar.