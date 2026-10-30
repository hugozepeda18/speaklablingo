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