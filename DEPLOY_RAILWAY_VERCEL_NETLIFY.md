Guía completa de despliegue (Railway backend + Vercel/Netlify frontend)

## Resumen Arquitectura
- Backend: Express + MySQL en Railway. Acceso mediante env vars (`MYSQL_PUBLIC_URL`, `JWT_SECRET`, `CORS_ORIGIN`).
- Frontend: Vite React en Vercel o Netlify (build estático en carpeta `build`). Usa `VITE_API_URL` para apuntar al backend.
- Autenticación: JWT firmado con `JWT_SECRET` (debe existir al iniciar el backend; en producción el server se detiene si falta).

## 1) Preparar Base de Datos en Railway
1. Crea servicio MySQL (o usa el generado por Railway). Obtén la URL (similar a `mysql://root:XXXX@host:port/railway`).
2. Importar schema:
   - Opción Workbench: Conectar usando la URL (desglosa host, port, user, password y DB). Ejecuta contenido de `server/sql/schema.sql` (ya sin `USE`).
   - Opción CLI local:
     ```powershell
     mysql -h <host> -P <port> -u root -p <database> < server/sql/schema.sql
     ```
   - Opción script PowerShell (requiere cliente mysql o Docker):
     ```powershell
     .\scripts\import_schema.ps1 -Host <host> -Port <port> -User root -Database railway -SchemaPath server/sql/schema.sql
     ```
3. (Opcional) Cambiar contraseña y eliminar seed de admin para producción. El seed usa contraseña `ChangeMe123!`. Genera un hash nuevo si la modificas:
   ```powershell
   node -e "require('bcryptjs').hash('TuNuevaPassSegura',10).then(h=>console.log(h))"
   ```

## 2) Variables de Entorno Backend en Railway
Configura en el panel del servicio Node:
```
MYSQL_PUBLIC_URL=<tu_url_mysql>
JWT_SECRET=<cadena_larga_aleatoria>
CORS_ORIGIN=https://tu-vercel.app,https://tu-netlify.netlify.app
NODE_ENV=production
```
Comando de inicio: `npm run server`

Sugerencia para generar JWT_SECRET (PowerShell):
```powershell
[System.Convert]::ToBase64String((New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes(32))
```

## 3) Desplegar Backend
1. Crea nuevo servicio Node en Railway apuntando al repo o sube manualmente.
2. Railway instala dependencias (`npm install`).
3. Se ejecuta `npm run server` (escucha en `PORT` default 4000, Railway asigna uno interno y expone HTTP).
4. Verifica:
   ```powershell
   curl https://<tu-backend>.railway.app/health
   curl https://<tu-backend>.railway.app/games
   ```

## 4) Desplegar Frontend en Vercel
1. Nuevo proyecto -> Importar repo.
2. Env vars (Production):
   - `VITE_API_URL=https://<tu-backend>.railway.app`
3. Build & Output:
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Deploy y probar navegación y login.

## 5) Desplegar Frontend en Netlify
1. Nuevo site desde Git.
2. Site Settings -> Env vars:
   - `VITE_API_URL=https://<tu-backend>.railway.app`
3. Build: `npm run build` | Publish: `build`
4. Deploy y prueba.

## 6) CORS
Backend permite localhost siempre. Para producción define dominios exactos en `CORS_ORIGIN`. Puedes añadir varios separados por coma. Ejemplo:
```
CORS_ORIGIN=https://retro-vercel.app,https://retro-netlify.netlify.app
```

## 7) Docker (¿Es necesario?)
No obligatorio para despliegue (Railway ya gestiona contenedores). Útil si:
- Quieres reproducir localmente backend + una instancia MySQL sin instalar MySQL.
- Necesitas entorno aislado para desarrollo.
Para uso simple (solo frontend + backend apuntando a DB remota) puedes omitir Docker.

## 8) Pruebas Locales con DB Remota
```powershell
$env:MYSQL_PUBLIC_URL="mysql://root:PASS@host:port/railway"
$env:JWT_SECRET="dev_secret_123"
$env:CORS_ORIGIN="http://localhost:5173"
node server/index.js
```
Luego en otro terminal:
```powershell
npm run dev
```

## 9) Checklist Final
- [ ] DB importada y tablas presentes (`users`, `games`, `scores`, etc.).
- [ ] `JWT_SECRET` configurado en Railway.
- [ ] `MYSQL_PUBLIC_URL` correcta (sin caracteres extra).
- [ ] `CORS_ORIGIN` con dominios de producción.
- [ ] Frontend build apunta a `VITE_API_URL` correcto.
- [ ] Login/Register funcionan y guardan token en localStorage.
- [ ] Puntajes actualizan `newRecord` correctamente.

## 10) Rotación y Seguridad
- Cambia la contraseña del seed admin tras primer login.
- Usa un gestor para tus secretos (Railway env vars ya ocultan valores).
- No commitear archivos `.env` con datos sensibles.

## 11) Problemas Comunes
- Error CORS: revisar dominios en `CORS_ORIGIN`.
- Token inválido: confirmar `JWT_SECRET` consistente (no cambiarlo sin invalidar sesiones).
- 500 DB error: validar que la URL MySQL sigue activa (plan gratuito puede dormir; reinicia servicio).

---
Actualizada para despliegue desde cero y recomendaciones de seguridad.
