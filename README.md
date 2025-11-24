# 🎮 Retro Gaming Web App (Fullstack)

Aplicación web para jugar 3 clásicos videojuegos (**Snake**, **Pong**, **Tetris**), aprender su historia y creadores, y competir en rankings globales con sistema de autenticación, comentarios públicos, reportes privados y panel de administración.

🎯 **Totalmente responsivo** - Funciona perfectamente en celular, tablet y desktop con:
- Controles táctiles optimizados (botones 48x48px)
- **Gestos de swipe** (deslizamiento) para controlar juegos en celular 📱

## 📋 Descripción del Sistema

**Funcionalidades Principales:**

- **Juegos Interactivos:** 3 juegos completamente funcionales (Snake, Pong, Tetris)
  - 🕹️ Controles por teclado (desktop)
  - 👆 Botones táctiles (celular/tablet)
  - 👋 **Gestos de swipe** (deslizar con el dedo en celular)
- **Sistema de Puntajes (CRUD Completo):**
  - **CREATE (POST):** Registrar puntaje tras cada partida
  - **READ (GET):** Consultar rankings globales e historial personal
  - **UPDATE (PUT):** Editar nombre en ranking y (admin) ajustar puntaje
  - **DELETE (DELETE):** Eliminación de puntajes (admin)

- **Autenticación JWT:** Roles usuario/admin con tokens seguros
- **Rankings Globales:** Top 50 por juego con detección de nuevo récord personal
- **Nombre Personalizado:** Cada usuario define su nombre de ranking por juego
- **Historial de Partidas:** Registro completo de todas las jugadas
- **Comentarios Públicos:** Comunidad puede comentar en cada juego
- **Reportes Privados:** Sistema para reportar bugs al administrador
- **Panel Administrativo:** Gestión completa de usuarios, puntajes, comentarios y reportes

## 📁 Estructura del Proyecto

```
.
├── src/                    # Frontend React + Vite + TypeScript
│   ├── components/         # Componentes React (15+ componentes)
│   ├── lib/               # Funciones utilitarias (API client)
│   ├── styles/            # Estilos CSS globales
│   └── main.tsx          # Punto de entrada
├── server/                # Backend Express.js + MySQL
│   ├── routes/            # auth, games, me, admin
│   ├── middleware/        # Autenticación JWT
│   ├── sql/              # Schema y seeds de base de datos
│   └── index.js          # Servidor Express
├── build/                 # Build de producción (generado)
└── package.json          # Dependencias

```

## ⚙️ Requisitos Previos

- **Node.js 18+**
- **MySQL Server 8+**
- **MySQL Workbench** (para administrar la BD)

## 🔧 Configuración de Base de Datos

### Paso 1: Crear la Base de Datos

1. Abre **MySQL Workbench**
2. Conéctate a tu servidor MySQL local
3. Abre el archivo: `server/sql/schema.sql`
4. Ejecuta el script completo (Ctrl+Enter)

Esto creará:
- Base de datos: `retro_gaming`
- 6 tablas: users, games, scores, comments, reports, user_games
- Datos iniciales: 3 juegos + usuarios de prueba

### Paso 2: Crear Variables de Entorno

Crea el archivo `server/.env`:

```
PORT=4000
JWT_SECRET=tu_secreto_super_largo_minimo_32_caracteres
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=retro_gaming
CORS_ORIGIN=http://localhost:5173
```

### Credenciales de Prueba

Después de ejecutar el schema.sql:
- **Usuario normal:** luis@gmail.com / luis2025
- **Administrador:** andrew@gmail.com / andrew2025

## 🚀 Instalación y Ejecución

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Iniciar el Backend (Express)

```bash
npm run server:dev
```

El servidor estará en: http://localhost:4000

### 3. Iniciar el Frontend (Vite)

```bash
npm run dev
```

La aplicación abrirá en: http://localhost:5173

## 📡 API Endpoints Principales

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión

### Juegos
- `GET /games` - Lista todos los juegos
- `GET /games/:slug` - Detalles de un juego
- `GET /games/:slug/rankings` - Top 50 por juego

### Puntajes
- `POST /games/:slug/scores` - Registrar puntaje
- `GET /me/scores` - Historial personal

### Perfil
- `GET /me` - Información del usuario
- `PUT /me/ranking-name` - Cambiar nombre en ranking

### Comunidad
- `GET /games/:slug/comments` - Comentarios públicos
- `POST /games/:slug/comments` - Crear comentario
- `POST /games/:slug/reports` - Reportar bug/problema

### Administración (solo admin)
- `GET /admin/comments` - Gestionar comentarios
- `GET /admin/reports` - Gestionar reportes
- `PUT /admin/scores/:id` - Editar puntaje
- `DELETE /admin/users/:id` - Eliminar usuario
### Panel de Administración (admin)
- `GET /admin/overview` - Estadísticas generales
- `GET /admin/comments` - Lista de comentarios
- `DELETE /admin/comments/:id` - Eliminar comentario
- `GET /admin/reports` - Lista de reportes
- `PUT /admin/reports/:id` - Marcar reporte como visto
- `GET /admin/scores` - Lista de puntajes
- `PUT /admin/scores/:id` - Editar puntaje
- `DELETE /admin/scores/:id` - Eliminar puntaje

**Validación:** Todos los datos se validan con Zod en backend y SQL parametrizado con mysql2/promise.

## 🌐 Despliegue en Producción (Railway + Vercel)

### Instrucciones de Despliegue

1. **Backend (Railway):**
   - Conecta repositorio GitHub a Railway
   - Configura variables de entorno en Railway:
     - `MYSQL_PUBLIC_URL` - Conexión a base de datos
     - `JWT_SECRET` - Token seguro (32+ caracteres)
     - `CORS_ORIGIN` - Dominio del frontend Vercel
     - `PORT` - 4000

2. **Frontend (Vercel):**
   - Importa repositorio desde GitHub
   - Vercel detecta Vite automáticamente
   - Configura variable: `VITE_API_URL` = URL del backend Railway

3. **Base de Datos:**
   - Crea base de datos MySQL en Railway o planeta scale
   - Ejecuta `server/sql/schema.sql` en la BD
   - Obtén la cadena de conexión pública

4. **Verificación:**
   - Prueba endpoints desde: https://insomnia.rest o Postman
   - Verifica CORS está configurado correctamente
   - Comprueba JWT generado correctamente

**URL Final:** `https://<tu-proyecto>.vercel.app`

### Credenciales de Demo

- **Usuario:** luis@gmail.com / luis2025
- **Admin:** andrew@gmail.com / andrew2025

## 🔒 Notas de Seguridad

- ⚠️ **JWT_SECRET**: Usa valor largo y aleatorio; NUNCA lo commits en Git
- ⚠️ **Contraseña Admin**: Cambia en primera ejecución en producción
- ⚠️ **CORS**: Configura solo dominios autorizados en Railway
- ⚠️ **Rate Limiting**: Implementar en endpoints críticos (auth, scores)
- ⚠️ **Validación**: Todos los inputs validados con Zod antes de BD
- ⚠️ **SQL Injection**: Prevenido con SQL parametrizado (mysql2/promise)

## ✅ Validación de Integración

- ✅ `AuthModal` - Registro/login con API, JWT en localStorage
- ✅ `GamePage` - Envía puntajes, muestra rankings, comentarios/reportes
- ✅ `RankingsPage` - Ranking global top 50 por juego
- ✅ `ProfilePage` - Edita nombre por juego, ve historial
- ✅ `AdminPage` - Modera contenido, gestiona puntajes
- ✅ **Responsivo:** Funciona 100% en móvil (Android/iOS) con controles táctiles
- ✅ **Gestos de Swipe:** Deslizamiento táctil para controlar juegos en celular

## 📚 Documentación Adicional

- **PLAN_PRUEBAS_DESPLIEGUE_CICD.md** - 📋 Plan completo de pruebas y despliegue CI/CD con Vercel, Railway y GitHub (Actividad 3)
- **INFORME_TECNICO.md** - Documentación técnica detallada (arquitectura, schema BD, etc.)
- **GESTOS_TACTILES.md** - Guía de gestos de swipe y cómo funcionan en cada juego
- **src/Attributions.md** - Créditos y referencias de recursos
- Documentación de código en español en todos los archivos fuente
  