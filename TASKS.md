# MVP Implementation Tasks

Reglas para el Agente:
1. Completar en orden.
2. Realizar testing simulando un dispositivo móvil.

---

- [x] **Fase 1: Base de Datos, Tipos y Storage**
  - [x] Escribir migraciones SQL para `LingoModule`, `LingoExercise`, `StudentLingoProgress` y `LingoCompletionLog`.
  - [x] Escribir migración para el bucket `lingo_audios`.
  - [x] Implementar políticas RLS para lectura pública de módulos/ejercicios y escritura segura de progreso por alumno.

- [x] **Fase 2: Motor de Estado de la Lección (Zustand sin Vidas)**
  - [x] Configurar store de Zustand para manejar: `ejerciciosPendientes`, `ejercicioActual`, y `xpAcumulada`.
  - [x] Escribir la lógica de validación: si es correcta, remover del store; si es incorrecta, mover al final de la cola de `ejerciciosPendientes`.

- [x] **Fase 3: Interfaz Core (Mobile-First UI)**
  - [x] Construir layout base de la PWA (Header con Racha actual de fuego 🔥, barra de progreso superior).
  - [x] Construir componente `MultipleChoiceExercise`.
  - [x] Construir componente `FillBlankExercise` (Renderizado de texto con inputs integrados).
  - [x] Construir componente `ListeningExercise` (Botón de reproducción de audio grande, seguido de opciones de respuesta).

- [ ] **Fase 4: Sincronización Backend y Gamificación**
  - [ ] Crear Route Handler para procesar el final del módulo (cuando `ejerciciosPendientes` está vacío).
  - [ ] Actualizar `total_xp`, calcular la lógica de `current_streak` y actualizar `last_practice_date`.
  - [ ] Construir pantalla de "Success" mostrando el aumento de la racha y XP ganado.

- [ ] **Fase 5: Dashboard del Profesor (Integración SpeakLab)**
  - [ ] En el panel de Admin, crear interfaz para registrar un `LingoModule` atado a un `class_topic`.
  - [ ] Crear interfaz para subir un archivo MP3/WAV a `lingo_audios` al crear un ejercicio tipo `LISTENING`.
  - [ ] Dejar el esquema JSON de los ejercicios preparado en un Route Handler para una futura inyección directa desde la API de OpenAI.