# Guía Completa: Desplegar Frontend + Backend para Docente y Compañeros

**Objetivo**: Tener el proyecto funcional en internet (Vercel + Railway) accesible desde navegador.

**Tiempo estimado**: 15-20 minutos.

---

## PASO 1: Importar Schema a Railway (Base de Datos)

### Opción A: Usar MySQL Workbench (Recomendado si tienes instalado)

1. Abre MySQL Workbench.
2. **Crear conexión**:
   - Host: `yamabiko.proxy.rlwy.net`
   - Port: `36307`
   - Username: `root`
   - Password: `RZQJaKlKZPyScQSARuScxGGWCIxjTQDe`
   - Default Schema: `railway`
3. Prueba conexión y guarda.
4. Abre una nueva SQL tab y copia-pega todo el contenido de `server/sql/schema.sql`.
5. Ejecuta (Ctrl+Enter o botón Run).
6. **Verificación**: Deberías ver las 6 tablas creadas en el panel left (users, games, scores, comments, reports, user_games).

### Opción B: Usar Script PowerShell (Si no tienes Workbench)

```powershell
# Desde la raíz del proyecto en PowerShell
.\scripts\import_schema.ps1 `
  -Host yamabiko.proxy.rlwy.net `
  -Port 36307 `
  -User root `
  -Database railway `
  -SchemaPath server/sql/schema.sql

# Te pedirá contraseña: RZQJaKlKZPyScQSARuScxGGWCIxjTQDe
```

### Opción C: Comando CLI directo (Si tienes mysql cliente)

```powershell
mysql -h yamabiko.proxy.rlwy.net -P 36307 -u root -prZQJaKlKZPyScQSARuScxGGWCIxjTQDe railway < server/sql/schema.sql
```

**Si todo va bien**: Sin errores. Si ves "Duplicate key error", significa ya se ejecutó; es normal.

---

## PASO 2: Configurar Backend en Railway

1. Ve a https://railway.app (login con GitHub).
2. Crea nuevo Proyecto > Nuevo Servicio > selecciona tu repo GitHub.
3. **Environment Variables** (importante):
   ```
   MYSQL_PUBLIC_URL=mysql://root:RZQJaKlKZPyScQSARuScxGGWCIxjTQDe@yamabiko.proxy.rlwy.net:36307/railway
   JWT_SECRET=17a99556c13e1ae039257d264e4df629a31e28ce0980fcac4dd6dcb0f4d54608
   NODE_ENV=production
   CORS_ORIGIN=https://<TU_DOMINIO_VERCEL>.vercel.app
   ```
   (Reemplaza `<TU_DOMINIO_VERCEL>` luego de crear proyecto Vercel).

4. **Start Command**: 
   ```
   npm run server
   ```

5. Deploy y espera 1-2 min. Debería mostrar URL como `https://retro-xxxx.railway.app`.

**Verificación** (desde navegador o PowerShell):
```powershell
curl https://<tu-url-railway>.railway.app/health
# Debe devolver: {"ok":true}

curl https://<tu-url-railway>.railway.app/games
# Debe devolver: [{"id":1,"slug":"snake",...}]
```

---

## PASO 3: Desplegar Frontend en Vercel

1. Ve a https://vercel.com.
2. Import Project > GitHub > selecciona `retro_arcades`.
3. **Framework**: Vite (detecta automáticamente).
4. **Build**:
   - Build Command: `npm run build`
   - Output Directory: `build`
5. **Environment Variables**:
   ```
   VITE_API_URL=https://<tu-url-railway>.railway.app
   ```
   (Reemplaza con la URL del paso 2).
6. Deploy.

**Tu URL final de frontend**: Vercel te da algo como `https://retro-arcades.vercel.app`.

**AHORA**: Actualiza env var `CORS_ORIGIN` en Railway si no lo hiciste:
```
CORS_ORIGIN=https://<tu-dominio-vercel>.vercel.app
```

---

## PASO 4: Verificación Final

Desde navegador, ve a `https://<tu-dominio-vercel>.vercel.app` y prueba:

- [ ] Página carga sin errores.
- [ ] Botón "Sign In" visible.
- [ ] Click en "Sign In" → abre modal login.
- [ ] Completa:
  - Email: `admin@retro.com`
  - Password: `ChangeMe123!`
- [ ] Click "Sign In" → token guardado, usuario visible en top-right.
- [ ] Navega a un juego (Snake, Pong, Tetris).
- [ ] Intenta jugar y guardar puntaje.
- [ ] Mira ranking → debe mostrar puntajes.

**Si todo funciona**: ¡Éxito! Comparte URL con compa.

---

## PASO 5: Compartir URL con Docente y Compañeros

Envía esto:

> **🎮 Retro Gaming Web App (Desplegado)**
>
> URL: https://retro-arcades.vercel.app
>
> **Credenciales de prueba:**
> - Email: `admin@retro.com`
> - Password: `ChangeMe123!`
>
> **Funcionalidades:**
> - Registrarse/Login con email.
> - Jugar Snake, Pong, Tetris.
> - Ver ranking global y personal.
> - Comentarios y reportes en juegos.
> 
> Cualquier problema, reportar a [tu email].

---

## Troubleshooting

### Error: "Cannot connect to database"
- Verifica que `MYSQL_PUBLIC_URL` en Railway sea exacta (sin espacios).
- Reinicia el servicio Node en Railway.
- Comprueba que el schema se importó sin errores.

### Error: "Token inválido"
- Asegúrate que `JWT_SECRET` en Railway sea exacto (copia sin espacios).
- No cambies el JWT_SECRET después de generar tokens (invalidaría sesiones).

### CORS error en consola del navegador
- Verifica que `CORS_ORIGIN` en Railway incluya el dominio de Vercel.
- Ejemplo correcto: `https://retro-arcades.vercel.app` (sin trailing slash).

### Login no guarda sesión
- Abre DevTools (F12) → Application → LocalStorage → verifica que exista key `token`.
- Si no aparece, error de registro/login en backend.

### Puntajes no se guardan
- Ve a DevTools → Network → busca `POST /games/*/scores`.
- Si falla con 401, token expiró; haz logout y login de nuevo.

---

## Notas Finales

- **Contraseña admin por cambiar**: La contraseña `ChangeMe123!` es de demo. Tras primer login, puedes cambiarla en BD.
- **Base de datos plan gratuito**: Railway puede hibernar si no hay actividad por horas (normal en plan free). Reinicia el servicio si ves errores DB.
- **Dominio personalizado**: Puedes comprar dominio en Vercel o usar DNS externo. Fuera de alcance aquí.

¡Listo! Compartir URL y disfrutar. 🚀
