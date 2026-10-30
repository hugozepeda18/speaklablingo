# Local Environment Runbook

## 1. Configuración de Base de Datos y Storage (Shared Supabase)
1. Enlaza este proyecto al proyecto existente de Supabase de SpeakLab.
2. Aplica las migraciones de las tablas exclusivas de Lingo (`LingoModule`, `LingoExercise`, `StudentLingoProgress`).
3. Crea un bucket público en Supabase Storage llamado `lingo_audios` para hospedar los ejercicios de escucha.

## 2. Configuración Local
```bash
# Instalar paquetes
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

## 3. Configuración PWA
* El archivo `manifest.json` en `/public` debe incluir iconos (192x192, 512x512), `display: "standalone"`, y `theme_color`. Esto permite que el navegador ofrezca la opción de "Agregar a la pantalla de inicio".

## 4. Notas locales
* El stack local usa los puertos **547xx** (API `http://127.0.0.1:54721`, Studio `:54723`) para no chocar con otros proyectos Supabase.
* `supabase db reset` aplica migraciones, `seed.sql` y sube el audio demo de `supabase/seed/lingo_audios/`.
* Tests: `supabase test db` (SQL/RLS) y `npm test` (store de la lección).
* `.env.local` necesita también `SUPABASE_SERVICE_ROLE_KEY` (solo servidor).

## 5. Profesores (Admin)
* Un profesor es un usuario con `app_metadata.role = "admin"` (solo asignable con la service role):
  ```bash
  curl -X PUT "$SUPABASE_URL/auth/v1/admin/users/<user_id>" \
    -H "apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
    -d '{"app_metadata":{"role":"admin"}}'
  ```
* Panel: `/admin`. API para IA: `GET /api/admin/modulos` devuelve el JSON Schema (OpenAI Structured Outputs); `POST` con ese payload crea el módulo.
