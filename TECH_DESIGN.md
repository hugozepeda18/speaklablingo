# Technical Design Document (TDD) - Speaklablingo (PWA MVP)

## 1. Stack & Arquitectura
* **Frontend:** Next.js 14+ (App Router) configurado como PWA (Mobile-first design). Tailwind CSS y Framer Motion para transiciones suaves.
* **Backend & Base de Datos:** Supabase (PostgreSQL). Comparte la base de datos con `SpeakLab` (Tabla `StudentProfile`).
* **Almacenamiento:** Supabase Storage (Bucket `lingo_audios` para los ejercicios de escucha).
* **Estado Global:** Zustand (para manejar el progreso de la sesión actual sin recargas).

## 2. Modelado de Datos (Supabase Schema)
* **`LingoModule` (Generación por Tema de Clase):**
  * `id`: UUID (PK)
  * `language`: Enum ('EN', 'FR', 'IT', 'PT', 'DE')
  * `cefr_level`: Enum ('A1', 'A2', 'B1', 'B2') # IT, PT, DE limitados a B1 por lógica de negocio.
  * `class_topic`: String (Ej. "Passé Composé con Être" - Referencia para futura IA).
  * `title`: String
* **`LingoExercise`:**
  * `id`: UUID (PK)
  * `module_id`: UUID (FK -> LingoModule)
  * `type`: Enum ('MULTIPLE_CHOICE', 'FILL_BLANK', 'LISTENING')
  * `question`: String (Texto de la pregunta o instrucción)
  * `options`: JSONB (Array de respuestas para múltiple opción/completar)
  * `correct_answer`: String
  * `audio_url`: String (Nullable, URL del archivo en Supabase Storage para LISTENING)
* **`StudentLingoProgress`:**
  * `student_id`: UUID (PK, FK -> StudentProfile)
  * `total_xp`: Int
  * `current_streak`: Int
  * `last_practice_date`: Date
* **`LingoCompletionLog`:**
  * `id`: UUID (PK)
  * `student_id`: UUID
  * `module_id`: UUID
  * `completed_at`: Timestamp

## 3. Lógica de Negocio y Reglas Core
* **Core Game Loop (Sin Vidas):**
  1. El alumno abre la PWA y selecciona su práctica diaria (ligada al `class_topic` reciente).
  2. Se cargan los `LingoExercises` correspondientes.
  3. El alumno responde. Si se equivoca, el ejercicio se vuelve a poner al final de la cola hasta que lo responda correctamente. No hay castigo ni vidas perdidas.
  4. El módulo solo se marca como terminado cuando *todos* los ejercicios han sido respondidos correctamente.
* **Cálculo de Rachas (Streaks):**
  * Al completar un módulo, si `last_practice_date` es el día de ayer, `current_streak += 1`.
  * Si `last_practice_date` es de hoy, no suma racha pero sí suma XP.
  * Si el último login fue hace más de 48 horas, `current_streak` se reinicia a 1.
* **Integración SpeakLab:** 
  * Terminar la lección dispara un evento que marca la actividad del día como hecha, silenciando los recordatorios automáticos de WhatsApp/Telegram de la plataforma principal.

## 4. UI/UX (Mobile-First)
* Diseño 100% táctil. Botones grandes en la zona inferior (pulgar).
* Reproductor de audio nativo y minimalista para los ejercicios `LISTENING`.
* Barras de progreso que solo avanzan con respuestas correctas.