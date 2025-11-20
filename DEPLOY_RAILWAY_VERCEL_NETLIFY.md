Guía de despliegue rápido (Railway backend + Vercel/Netlify frontend)

Resumen
- Backend: desplegar en Railway (Node + MySQL). Debe usar `MYSQL_PUBLIC_URL` en Environment Variables.
- Frontend: desplegar en Vercel o Netlify. Configurar `VITE_API_URL` apuntando a la URL pública del backend.

1) Backend - Railway
- En Railway, añade/actualiza las Environment Variables del proyecto/backend:
  - `MYSQL_PUBLIC_URL` = mysql://root:TU_PASS@shinkansen.proxy.rlwy.net:15275/railway
  - `JWT_SECRET` = (cadena segura)
  - `CORS_ORIGIN` = https://<tu-frontend> (o http://localhost:5173 para pruebas)
- Start Command: `npm run server`
- Build: Railway instalará dependencias. Asegúrate de que `package.json` tiene `server` script (ya existe).
- Reinicia/despliega el servicio.
- Comprobar endpoint:
  - `GET /health` debería devolver `{ "ok": true }`.

2) Frontend - Vercel
- En Vercel crea un nuevo proyecto apuntando al repositorio.
- Setea Environment Variable en Vercel:
-  - `VITE_API_URL` = https://<tu-backend>.railway.app (la URL pública del servicio Railway)
- Framework Preset: `Vite` (Vercel detecta automáticamente).
- Build Command: `npm run build`
- Output Directory: `build` (el proyecto usa `build` como salida en `vite.config.ts`)
- Deployar y verificar la URL pública.

3) Frontend - Netlify
- En Netlify crea un nuevo site desde Git -> tu repo.
- Environment Variables en Site Settings:
  - `VITE_API_URL` = https://<tu-backend>.railway.app
- Build command: `npm run build`
- Publish directory: `build`
- Deploy y comprobar.

4) Notas adicionales
- Asegúrate de que la base de datos que usa el backend (ruta en `MYSQL_PUBLIC_URL`) contiene las tablas. Si ejecutaste `server/sql/schema.sql` con `USE railway;`, ya están creadas.
- Rotar la contraseña en Railway si fue expuesta accidentalmente.
- No subir `server/.env` al repo. Usa Railway env vars para producción.

5) Verificación final
- Desde local (si el backend corre local con env vars apuntando a Railway) ejecuta:
  - `Invoke-RestMethod -Uri http://localhost:4000/health`
  - `curl https://<tu-backend>.railway.app/games`

Si quieres, aplico cambios adicionales al repo (README o scripts) o hago la actualización de `server/.env` para apuntar a `/railway` si confirmas.  
