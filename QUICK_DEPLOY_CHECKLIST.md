# ⚡ RESUMEN DESPLIEGUE RÁPIDO

## Objetivo
Desplegar aplicación Retro Gaming para que **docente y compañeros** accedan vía URL desde navegador.

## Recomendación
✅ **Vercel (Frontend) + Railway (Backend)**
- Más rápido y confiable.
- Acceso público sin instalar nada.
- Plan gratuito es suficiente.

❌ Netlify / Docker: Innecesarios para este caso.

---

## CHECKLIST PASO-A-PASO

### 1️⃣ Base de Datos (Railway)
- [ ] Conexión: `mysql://root:RZQJaKlKZPyScQSARuScxGGWCIxjTQDe@yamabiko.proxy.rlwy.net:36307/railway`
- [ ] Importar `server/sql/schema.sql` vía Workbench o CLI
- [ ] Verificar 6 tablas creadas (users, games, scores, etc.)

### 2️⃣ Backend (Railway)
- [ ] Crear nuevo servicio Node en Railway desde tu repo GitHub
- [ ] Environment Variables:
  ```
  MYSQL_PUBLIC_URL=mysql://root:RZQJaKlKZPyScQSARuScxGGWCIxjTQDe@yamabiko.proxy.rlwy.net:36307/railway
  JWT_SECRET=17a99556c13e1ae039257d264e4df629a31e28ce0980fcac4dd6dcb0f4d54608
  NODE_ENV=production
  CORS_ORIGIN=https://<TU_DOMINIO_VERCEL>.vercel.app
  ```
- [ ] Start Command: `npm run server`
- [ ] Obtener URL pública (ej: `https://retro-xxxx.railway.app`)
- [ ] Test: `curl https://retro-xxxx.railway.app/health` → `{"ok":true}`

### 3️⃣ Frontend (Vercel)
- [ ] Conectar repo GitHub a Vercel
- [ ] Framework: Vite (auto-detectado)
- [ ] Build: `npm run build`
- [ ] Output: `build`
- [ ] Environment Variable:
  ```
  VITE_API_URL=https://<URL_RAILWAY_DEL_PASO_2>.railway.app
  ```
- [ ] Deploy
- [ ] Obtener URL (ej: `https://retro-arcades.vercel.app`)

### 4️⃣ Actualizar CORS (Railway)
- [ ] En Railway Backend, actualizar env var:
  ```
  CORS_ORIGIN=https://<URL_VERCEL_DEL_PASO_3>.vercel.app
  ```
- [ ] Reiniciar servicio

### 5️⃣ Verificación Final
- [ ] Abre `https://<URL_VERCEL>` en navegador
- [ ] Login: `admin@retro.com` / `ChangeMe123!`
- [ ] Jugar un juego y guardar puntaje
- [ ] Ver ranking actualizado

### 6️⃣ Compartir con Docente y Compañeros
- [ ] Envía URL: `https://<tu-dominio>.vercel.app`
- [ ] Credenciales: `admin@retro.com` / `ChangeMe123!`
- [ ] Instrucción: "Abre el link, haz login y juega"

---

## DETALLES

**JWT_SECRET ya generado:**
```
17a99556c13e1ae039257d264e4df629a31e28ce0980fcac4dd6dcb0f4d54608
```

**Contraseña admin seed:**
```
ChangeMe123!
```

**Documentación completa:** Ver `SETUP_DEPLOYMENT.md`

**Verificación técnica:** Ver `scripts/VERIFICACION_DEPLOYMENT.md`

---

## ¿PROBLEMAS?

1. **Error CORS**: Revisar `CORS_ORIGIN` en Railway (debe incluir dominio Vercel)
2. **Token inválido**: No cambies `JWT_SECRET` una vez generado
3. **DB dormida**: Plan free Railway puede hibernar; reinicia servicio
4. **404 en juegos**: Verificar que schema se importó correctamente

---

## TIMELINE ESTIMADO
- Importar schema: 2 min
- Configurar Railway: 5 min
- Deploy Vercel: 3 min
- Verificación: 2 min
- **Total: ~12 minutos**

✅ Listo para compartir!
