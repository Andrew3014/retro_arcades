# ⚡ Quick Start Deploy

Instrucciones rápidas para desplegar en 5 minutos.

## 🟦 Railway (RECOMENDADO) - 5 minutos

1. **Haz login en [railway.app](https://railway.app) con GitHub**

2. **New Project → Deploy from GitHub repo → Selecciona `retro_arcades`**

3. **Railway detecta Node.js automáticamente**

4. **Haz click en tu proyecto → Variables → Agrega:**
```
PORT=4000
JWT_SECRET=mi_secreto_super_largo_minimo_32_caracteres
DB_HOST=tu-mysql.mysql.railway.internal
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=retro_gaming
CORS_ORIGIN=https://tu-proyecto.railway.app
NODE_ENV=production
```

5. **Crea una BD MySQL:**
   - New → Database → MySQL
   - Las credenciales se agregan automáticamente a Variables

6. **Ejecuta el schema:**
   - Descarga MySQL Workbench
   - Conecta usando credenciales de Railway
   - Ejecuta `server/sql/schema.sql`

7. **Espera a que Railway despliegue (5-10 min)**

8. **Verifica:** `https://tu-proyecto.railway.app/health`
   - Debería retornar: `{"ok":true}`

✅ **¡Listo!**

---

## 🟩 Vercel (Frontend) + Railway (Backend) - 10 minutos

### Frontend en Vercel

1. Ve a [vercel.com](https://vercel.com) → Import Project
2. Selecciona tu repo GitHub
3. Framework: **Vite**
4. Environment Variables:
```
VITE_API_URL=https://tu-backend-railway.app
```
5. Deploy

### Backend en Railway
- Sigue pasos de Railway arriba

---

## 🟪 Render - 10 minutos

### Backend

1. Ve a [render.com](https://render.com) → New Web Service
2. Conecta GitHub → Selecciona repo
3. **Settings:**
   - Name: `retro-gaming-api`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm run server`

4. **Environment Variables:** (igual que Railway)

5. Deploy

### Base de datos MySQL

- Ve a Render → New → Database → MySQL
- Copia credenciales a Variables

### Frontend (Vercel)
- Sigue pasos Vercel arriba, pero usa `VITE_API_URL=https://tu-backend-render.com`

---

## 🟥 Heroku - 15 minutos (Legacy)

```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Create app
heroku create mi-retro-app

# 4. Create Procfile (ya existe)
# Contenido: web: npm run server

# 5. Add MySQL (JawsDB)
heroku addons:create jawsdb:kitefin

# 6. Set environment variables
heroku config:set JWT_SECRET=mi_secreto_aqui
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://mi-retro-app.herokuapp.com

# 7. Deploy
git push heroku main

# 8. Check logs
heroku logs --tail
```

---

## 🌐 Netlify (Frontend) - 5 minutos

1. Ve a [netlify.com](https://netlify.com)
2. Add new site → Import an existing project → GitHub
3. Selecciona tu repo
4. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `build`

5. **Environment variables:**
```
VITE_API_URL=https://tu-backend.com
```

6. Deploy

---

## ✅ Verificar que está funcionando

Después de deploy, prueba:

1. **Backend health check:**
```bash
curl https://tu-backend.com/health
# Debería retornar: {"ok":true}
```

2. **Frontend accesible:**
```bash
# Abre en navegador
https://tu-frontend.com
```

3. **Prueba login:**
   - Crea usuario
   - Inicia sesión
   - Juega
   - Guarda puntaje
   - Verifica que aparezca en rankings

4. **Prueba admin** (si tienes cuenta admin):
   - Ve a admin panel
   - Verifica métricas
   - Prueba eliminar/editar

---

## 🐛 Si algo no funciona

### Frontend dice "Cannot reach API"
- Verifica que `VITE_API_URL` en Vercel/Netlify sea correcto
- Verifica que backend está corriendo: `curl https://tu-backend.com/health`
- Verifica CORS: busca `CORS_ORIGIN` en variables de backend

### Backend no conecta a BD
- Verifica `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`
- Verifica que BD MySQL está corriendo
- Verifica que schema `server/sql/schema.sql` fue ejecutado
- Verifica firewall permite conexiones

### Errores de autenticación
- Verifica `JWT_SECRET` es igual en todas partes
- Borra localStorage (Ctrl+Shift+Delete) y vuelve a login

---

## 📊 URLs Finales

```
Frontend:  https://mi-retro-app.vercel.app
Backend:   https://mi-retro-api.railway.app
DB:        Configurada en backend
```

¡Comparte estas URLs con amigos! 🎉🕹️

---

## 💡 Pro Tips

1. **Siempre usa HTTPS** en producción
2. **Crea JWT_SECRET fuerte:** 
   ```bash
   openssl rand -hex 32
   ```
3. **Monitorea logs:** 
   - Railway: Dashboard → Logs
   - Render: Dashboard → Logs
   - Heroku: `heroku logs --tail`

4. **Backup de BD:** 
   - Haz dumps regulares de tu MySQL
   - O usa servicio con backups automáticos

5. **Escala:** 
   - Si necesitas más poder, upgrade el plan
   - Railway/Render tienen auto-scaling

---

**¿Preguntas?** Revisa DEPLOY.md para guías detalladas.
