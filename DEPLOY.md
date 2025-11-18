# 🚀 Guía de Despliegue - Retro Gaming Web App

Este documento explica cómo desplegar la aplicación en diferentes plataformas.

## 📋 Requisitos para desplegar

- Base de datos MySQL en la nube (p. ej., AWS RDS, PlanetScale, Render)
- Backend Node.js (p. ej., Heroku, Railway, Render, Fly.io)
- Frontend estático (p. ej., Vercel, Netlify, GitHub Pages)
- Dominio personalizado (opcional)

---

## 🟦 Opción 1: Deploy Full-Stack en Railway (Recomendado)

Railway es ideal porque maneja frontend, backend y MySQL en un solo lugar.

### Paso 1: Preparar el código

1. Crea un archivo `Procfile` en la raíz del proyecto:
```
web: npm run server
```

2. Asegúrate de que `package.json` tenga:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "server": "node server/index.js",
  "server:dev": "nodemon server/index.js"
}
```

3. Actualiza `.env.example` en `server/.env.example` con variables de entorno reales.

### Paso 2: Subir a GitHub

```bash
git add .
git commit -m "Preparar para deploy en Railway"
git push origin main
```

### Paso 3: Deploy en Railway

1. Ve a [railway.app](https://railway.app)
2. Haz login con GitHub
3. New Project → Deploy from GitHub repo
4. Selecciona tu repositorio `retro_arcades`
5. Railway detectará automáticamente Node.js

### Paso 4: Configurar variables de entorno en Railway

En el panel de Railway, ve a **Variables** y agrega:

```
PORT=4000
JWT_SECRET=tu_secreto_seguro_aqui_min_32_caracteres
DB_HOST=tu_mysql_host
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=retro_gaming
CORS_ORIGIN=https://tu-dominio.railway.app
NODE_ENV=production
```

### Paso 5: Crear base de datos MySQL

En Railway:
1. New → Database → MySQL
2. Copia las credenciales a las variables de entorno anteriores
3. Ejecuta el script `server/sql/schema.sql` en tu MySQL (p.ej. con MySQL Workbench)

### Paso 6: Verificar deploy

```
https://tu-proyecto.railway.app/health
```

Si ves `{"ok":true}`, ¡está funcionando!

---

## 🟩 Opción 2: Backend en Render + Frontend en Vercel

### Backend en Render

1. Ve a [render.com](https://render.com)
2. New → Web Service
3. Conecta tu GitHub
4. Selecciona tu repo
5. Configuración:
   - **Build Command:** `npm install`
   - **Start Command:** `npm run server`
   - **Environment:** Node.js
   - **Node Version:** 18

6. Agrega variables de entorno (igual que en Railway)

7. Deploy

### Frontend en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Import Project → Git
3. Selecciona tu repo
4. **Framework Preset:** Vite
5. Agrega variable de entorno:
   ```
   VITE_API_URL=https://tu-backend-render.com
   ```

6. Deploy

---

## 🟪 Opción 3: Backend en Heroku (Legacy pero aún funciona)

### Paso 1: Instalar Heroku CLI

```bash
npm install -g heroku
```

### Paso 2: Login en Heroku

```bash
heroku login
```

### Paso 3: Crear app

```bash
heroku create tu-app-name
```

### Paso 4: Configurar Procfile

```
web: npm run server
```

### Paso 5: Agregar MySQL (p. ej., JawsDB)

```bash
heroku addons:create jawsdb:kitefin
```

### Paso 6: Configurar variables de entorno

```bash
heroku config:set JWT_SECRET=tu_secreto_aqui
heroku config:set NODE_ENV=production
```

### Paso 7: Deploy

```bash
git push heroku main
```

### Paso 8: Ver logs

```bash
heroku logs --tail
```

---

## 🌐 Opción 4: Frontend en Netlify + Backend en Railway

### Frontend (Netlify)

1. Ve a [netlify.com](https://netlify.com)
2. Import an existing project → Git → GitHub
3. Selecciona tu repo
4. **Build command:** `npm run build`
5. **Publish directory:** `build`
6. **Environment variables:**
   ```
   VITE_API_URL=https://tu-backend-railway.app
   ```
7. Deploy

### Backend en Railway (igual que Opción 1)

---

## 🔑 Variables de entorno importantes

### Backend (server/.env)
```
PORT=4000                                    # Puerto (Railway/Render usan dinamicamente)
JWT_SECRET=min_32_caracteres_alfanumericos   # Cambia esto en producción
DB_HOST=tu-db-host.mysql.database.azure.com # Host MySQL en la nube
DB_PORT=3306                                 # Suele ser 3306
DB_USER=admin                                # Usuario MySQL
DB_PASSWORD=tu_password_fuerte               # Contraseña
DB_NAME=retro_gaming                         # Nombre base de datos
CORS_ORIGIN=https://tu-frontend.com          # URL del frontend
NODE_ENV=production                          # Siempre en producción
```

### Frontend (.env.local)
```
VITE_API_URL=https://tu-backend.com          # URL del backend en producción
```

---

## ✅ Checklist pre-deploy

- [ ] `.env.example` documentado con todas las variables
- [ ] `server/.env.example` configurado
- [ ] `Procfile` creado en raíz
- [ ] `package.json` tiene scripts: `dev`, `build`, `server`, `server:dev`
- [ ] `vite.config.ts` tiene `build.outDir = 'build'`
- [ ] `server/sql/schema.sql` actualizado con últimos cambios
- [ ] `.gitignore` excluye `.env`, `node_modules`, `build`, `dist`
- [ ] JWT_SECRET es fuerte (min 32 caracteres) en producción
- [ ] CORS_ORIGIN apunta a tu frontend en producción
- [ ] Base de datos MySQL creada y schema ejecutado
- [ ] Tests locales pasando (opcional)
- [ ] Logs y error handling revisados

---

## 🐛 Troubleshooting

### "Cannot find module 'dotenv'"
```bash
npm install --save dotenv
```

### Error de CORS en producción
Actualiza `CORS_ORIGIN` en variables de entorno del servidor

### Base de datos no conecta
Verifica:
- Host, puerto, usuario, contraseña en `.env`
- Firewall permite conexiones a tu MySQL host
- Base de datos `retro_gaming` existe y schema fue ejecutado

### Frontend no se conecta al backend
Verifica:
- `VITE_API_URL` apunta a la URL correcta del backend
- Backend está corriendo y accesible
- No hay errores de CORS en la consola del navegador

---

## 📞 URLs de referencia

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Heroku Docs](https://devcenter.heroku.com)
- [PlanetScale (MySQL)](https://planetscale.com)

---

## 🎉 ¡Listo!

Una vez deployed, tu aplicación será accesible globalmente. Comparte la URL con amigos y ¡comienza a competir en los rankings retro! 🕹️
