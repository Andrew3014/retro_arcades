# Informe de Actividad: Desarrollo y Mejora del Frontend

**Nombre de Actividad:** Desarrollo y mejora de la parte del frontend de la aplicación web propuesto por el estudiante

**Fecha:** 23 de Noviembre de 2025

**Estudiante:** Andrew Aguila

---

## 1. DESCRIPCIÓN DEL SISTEMA

### 1.1 Resumen Ejecutivo

**Retro Gaming Web App** es una aplicación web fullstack desarrollada con **React + Vite** (frontend) y **Node.js + Express** (backend), que permite a los usuarios jugar títulos retro clásicos (Snake, Pong, Tetris), ver su historia y creadores, competir en rankings globales, y participar en comunidades mediante comentarios y reportes.

La aplicación implementa un sistema completo de **autenticación con JWT**, gestión de **puntajes y rankings**, y un **panel administrativo** para moderación de contenido.

### 1.2 Tecnologías Utilizadas

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Frontend** | React + TypeScript | 18.3.1 |
| **Build Tool** | Vite | 6.3.5 |
| **Styling** | Tailwind CSS + Radix UI | - |
| **Backend** | Express.js | 4.19.2 |
| **Base de Datos** | MySQL 9.4.0 | - |
| **Autenticación** | JWT (jsonwebtoken) | 9.0.2 |
| **Hosting** | Railway (Backend) + Vercel (Frontend) | - |

### 1.3 Arquitectura del Proyecto

```
Retro Gaming Web App
├── Frontend (Vite React)
│   ├── src/
│   │   ├── components/     [Componentes React principales]
│   │   ├── pages/          [Pantallas principales]
│   │   ├── lib/            [Funciones API y utilidades]
│   │   └── styles/         [Estilos globales]
│   └── build/              [Output compilado]
│
├── Backend (Express Node.js)
│   ├── server/
│   │   ├── routes/         [Endpoints API]
│   │   ├── middleware/     [Auth y validaciones]
│   │   ├── db.js           [Conexión MySQL]
│   │   └── index.js        [Servidor principal]
│   └── sql/
│       └── schema.sql      [Estructura de BD]
│
└── Database (MySQL Railway)
    ├── users              [Cuentas de usuario]
    ├── games              [Juegos disponibles]
    ├── scores             [Puntajes y rankings]
    ├── comments           [Comentarios públicos]
    ├── reports            [Reportes de moderación]
    └── user_games         [Datos per-usuario por juego]
```

---

## 2. PANTALLAS IMPLEMENTADAS

### 2.1 Pantalla 1: Lista de Juegos (HomePage)

#### Descripción Funcional

La pantalla principal muestra una **lista de todos los juegos retro disponibles** obtenidos del backend mediante una petición GET. Cada juego se presenta en una tarjeta con información visual, histórica y opciones de interacción.

**Archivo:** `src/components/HomePage.tsx`

#### Funcionalidades Principales

✅ **GET de datos:** Obtiene lista completa de juegos desde `/games`

```typescript
// Llamada a backend
const games = await api.games(); // GET /games
```

✅ **Visualización personalizada:**
- Tarjetas con imagen de portada del juego
- Título, año de creación y nombre del creador
- Logo de la compañía desarrolladora
- Descripción histórica (expandible)
- Botón "Jugar" para acceder al juego

✅ **Diseño Personalizado:**
- Grid responsive (1-3 columnas según pantalla)
- Animaciones hover en tarjetas
- Colores retro (degradados morados y neón)
- Tipografía pixelada para temática arcade
- Iconos de Radix UI / Lucide React

✅ **Manejo de estados:**
- Estado de carga (skeleton loaders)
- Manejo de errores si la API falla
- Cache de datos para optimización

**Captura de pantalla - Lista de Juegos:**

[INSERTAR AQUÍ CAPTURA DE LA PANTALLA HOME CON LISTA DE JUEGOS]

---

### 2.2 Pantalla 2: Ranking y Formulario de Puntaje (GamePage)

#### Descripción Funcional

Al seleccionar un juego, se accede a una **pantalla detallada** que muestra:
1. **Ranking global** de jugadores (GET desde `/games/:slug/rankings`)
2. **Información del juego** (historia, creador, compañía)
3. **Juego playable** (miniaturizado o interactivo)
4. **Formulario para enviar puntaje** (POST a `/games/:slug/scores`)

**Archivo:** `src/components/GamePage.tsx`

#### Funcionalidades - Lectura de Datos (GET)

✅ **Obtener detalles del juego:**
```typescript
const game = await api.game(slug); // GET /games/:slug
```

✅ **Obtener ranking global:**
```typescript
const rankings = await api.rankings(slug, limit);
// GET /games/:slug/rankings?limit=50
// Retorna: [
//   { rank: 1, name: "Luis_Snake", score: 8, date: "2025-11-23" },
//   { rank: 2, name: "Maria_Gamer", score: 7, date: "2025-11-23" },
//   ...
// ]
```

✅ **Obtener puntaje personal (si está autenticado):**
```typescript
const myScore = await api.meGame(slug); 
// GET /games/:slug/me
// Retorna: { best: 8, rank: 1, rankingName: "Luis_Snake" }
```

#### Funcionalidades - Envío de Datos (POST)

✅ **Formulario de Envío de Puntaje:**

El usuario puede jugar y al terminar la partida:

1. **Se abre modal o formulario** con campos:
   - Score (numérico): validación de rango 0-9999
   - Ranking Name (texto): opcional, 3-30 caracteres

2. **Validaciones en frontend:**
   ```typescript
   const validation = scoreSchema.safeParse({
     score: 8,
     rankingName: "Luis_Snake"
   });
   
   if (!validation.success) {
     // Mostrar errores: "El puntaje debe ser un número"
     // "El nombre debe tener entre 3 y 30 caracteres"
   }
   ```

3. **Envío al backend (POST):**
   ```typescript
   const result = await api.submitScore(slug, score, rankingName);
   // POST /games/:slug/scores
   // Body: { score: 8, rankingName: "Luis_Snake" }
   // Response: { ok: true, newRecord: true, rank: 1 }
   ```

4. **Mensajes de validación y éxito:**
   - ✅ "¡Nuevo récord personal!" (si newRecord === true)
   - ✅ "Puntaje guardado. Tu posición: #1"
   - ❌ "Error: El puntaje debe ser válido"
   - ❌ "Error: No estás autenticado"

#### Diseño Personalizado

✅ **Interfaz del juego:**
- Área de juego grande y centrada
- Controles visuales e intuitos (flechas, botones)
- Visor de puntaje en tiempo real
- Contador de movimientos

✅ **Ranking:**
- Tabla con posiciones (oro, plata, bronce para top 3)
- Columnas: Posición | Nombre | Puntaje | Fecha
- Destacar tu puntaje personal (fondo de color)
- Scroll vertical si hay muchos resultados

✅ **Formulario de puntaje:**
- Modal semi-transparente
- Inputs con bordes redondeados
- Botones con efectos hover
- Colores en tema retro arcade

**Captura de pantalla - Detalle del Juego:**

[INSERTAR AQUÍ CAPTURA DEL JUEGO CON RANKING]

**Captura de pantalla - Formulario de Puntaje:**

[INSERTAR AQUÍ CAPTURA DEL MODAL DE ENVÍO DE PUNTAJE]

---

### 2.3 Pantalla Adicional: Panel de Comentarios

#### Descripción

Como funcionalidad adicional, se incluye una sección de **comentarios públicos** donde usuarios autenticados pueden:

✅ **Lectura de comentarios (GET):**
```typescript
const comments = await api.getComments(slug);
// GET /games/:slug/comments
// Retorna: [
//   { id: 1, author: "Luis_Snake", date: "2025-11-23", content: "¡Excelente juego!" },
//   ...
// ]
```

✅ **Crear comentario (POST):**
```typescript
await api.addComment(slug, "¡Snake es increíble!");
// POST /games/:slug/comments
// Body: { content: "¡Snake es increíble!" }
```

✅ **Validaciones:**
- Contenido entre 2-500 caracteres
- Mensaje de error si está vacío
- Toast de éxito al publicar

**Captura de pantalla - Comentarios:**

[INSERTAR AQUÍ CAPTURA DE LA SECCIÓN DE COMENTARIOS]

---

## 3. VALIDACIONES IMPLEMENTADAS

### 3.1 Validación en Frontend (Cliente)

Se utiliza la librería **Zod** para definir schemas de validación:

```typescript
// Ejemplo: Validación de puntaje
const scoreSchema = z.object({
  score: z.number().int().min(0).max(9999),
  rankingName: z.string().min(3).max(30).optional()
});

// Uso en formulario
const result = scoreSchema.safeParse(formData);
if (!result.success) {
  result.error.errors.forEach(err => {
    console.log(`${err.path.join('.')}: ${err.message}`);
  });
}
```

### 3.2 Mensajes de Validación Visuales

✅ **Errores mostrados en UI:**
- Toast notifications (Sonner) para éxito/error
- Inline errors en inputs (texto rojo debajo del campo)
- Modales de confirmación antes de acciones críticas

**Captura de pantalla - Validación de Errores:**

[INSERTAR AQUÍ CAPTURA CON MENSAJE DE ERROR EN VALIDACIÓN]

### 3.3 Validación en Backend

El backend también valida (defensa en profundidad):

```typescript
// Endpoint POST /games/:slug/scores
router.post('/:slug/scores', authRequired, async (req, res) => {
  const parse = scoreSchema.safeParse(req.body);
  
  if (!parse.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: parse.error.errors
    });
  }
  // ... procesamiento seguro
});
```

---

## 4. PERSONALIZACIÓN DEL DISEÑO

### 4.1 Paleta de Colores

| Elemento | Color | Uso |
|----------|-------|-----|
| Fondo principal | `#0f172a` (azul muy oscuro) | Tema retro arcade |
| Primario | `#a855f7` (púrpura) | Botones, acentos |
| Secundario | `#ec4899` (rosa neón) | Gradientes, hover |
| Éxito | `#10b981` (verde) | Mensajes positivos |
| Error | `#ef4444` (rojo) | Validaciones, alertas |
| Texto | `#f1f5f9` (gris claro) | Legibilidad |

### 4.2 Componentes Personalizados

✅ **GameCard.tsx** - Tarjeta individual de juego
- Imagen de portada con overlay
- Información animada al hover
- Botón "Jugar" degradado

✅ **GameControls.tsx** - Controles del juego
- Flechas direccionales responsivas
- Botones grandes y accesibles
- Indicadores visuales de estado

✅ **RankingsTable.tsx** - Tabla de rankings
- Estilos alternados por fila
- Iconos de medalla (🥇🥈🥉)
- Resaltado de fila personal

✅ **Navbar.tsx** - Barra de navegación
- Logo pixelado
- Menu de usuario autenticado
- Links responsive

### 4.3 Tipografía y Espaciado

✅ **Fuentes:**
- Títulos: `Press Start 2P` (pixelada, temática arcade)
- Body: `Inter` (legibilidad moderna)

✅ **Espaciado:**
- Padding estándar: `1rem` (16px)
- Gap entre componentes: `1.5rem` (24px)
- Bordes redondeados: `0.5rem` (8px)

✅ **Efectos:**
- Transiciones suave: 300ms ease-in-out
- Shadows para profundidad
- Gradientes purple-to-pink

**Captura de pantalla - Diseño General:**

[INSERTAR AQUÍ CAPTURA MOSTRANDO LA PALETA DE COLORES Y DISEÑO]

---

## 5. INTEGRACIÓN FRONTEND-BACKEND

### 5.1 Flujo de Peticiones API

```
Usuario (Frontend)
      |
      ├─> GET /games (Cargar lista de juegos)
      ├─> GET /games/:slug (Cargar detalle del juego)
      ├─> GET /games/:slug/rankings (Cargar ranking global)
      ├─> GET /games/:slug/me (Mi puntaje - si autenticado)
      ├─> POST /games/:slug/scores (Enviar nuevo puntaje)
      ├─> GET /games/:slug/comments (Cargar comentarios)
      ├─> POST /games/:slug/comments (Enviar comentario)
      └─> [Respuestas JSON desde Backend]
                 |
            Backend (Railway)
                 |
            Base de Datos (MySQL)
```

### 5.2 Archivos Clave

**Frontend (`src/lib/api.ts`):**
```typescript
export const api = {
  games: () => http('/games'),
  game: (slug) => http(`/games/${slug}`),
  rankings: (slug, limit) => http(`/games/${slug}/rankings?limit=${limit}`),
  submitScore: (slug, score, rankingName) => 
    http(`/games/${slug}/scores`, {
      method: 'POST',
      body: JSON.stringify({ score, rankingName })
    }),
  getComments: (slug) => http(`/games/${slug}/comments`),
  // ... más métodos
};
```

**Backend (`server/routes/games.js`):**
```javascript
// GET /games
router.get('/', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT id, slug, title, year, ... FROM games ORDER BY id'
  );
  res.json(rows);
});

// POST /games/:slug/scores
router.post('/:slug/scores', authRequired, async (req, res) => {
  // Validación, inserción en DB y respuesta
});
```

---

## 6. DATOS DE PRUEBA

### 6.1 Usuarios Seed Creados

Se implementó un **script SQL** (`seed_test_users.sql`) que genera:

| Usuario | Email | Puntajes | Rol |
|---------|-------|----------|-----|
| luis14 | luis@gmail.com | Snake: 8, Pong: 6, Tetris: 9 | user |
| maria25 | maria@gmail.com | Snake: 7, Pong: 5, Tetris: 8 | user |
| carlos33 | carlos@gmail.com | Snake: 9, Pong: 4, Tetris: 7 | user |
| ana42 | ana@gmail.com | Snake: 6, Pong: 8, Tetris: 5 | user |
| juan51 | juan@gmail.com | Snake: 5, Pong: 9, Tetris: 6 | user |
| sofia19 | sofia@gmail.com | Snake: 4, Pong: 7, Tetris: 9 | user |
| diego77 | diego@gmail.com | Snake: 8, Pong: 3, Tetris: 8 | user |
| laura88 | laura@gmail.com | Snake: 7, Pong: 6, Tetris: 4 | user |
| pedro99 | pedro@gmail.com | Snake: 9, Pong: 5, Tetris: 7 | user |
| isabel44 | isabel@gmail.com | Snake: 6, Pong: 8, Tetris: 3 | user |
| andrew30 | andrusaguila@gmail.com | Snake: 9, Pong: 9, Tetris: 9 | **admin** |

Contraseña estándar: `[nombre]2025` (ej: `luis2025`)

---

## 7. DESPLIEGUE Y ACCESO

### 7.1 URLs de Producción

| Componente | URL |
|-----------|-----|
| **Frontend (Vercel)** | [INSERTAR URL VERCEL AQUÍ] |
| **Backend (Railway)** | `https://retroarcades-production.up.railway.app` |
| **Base de Datos** | MySQL en Railway (plan gratuito) |

### 7.2 Credenciales de Prueba

```
Usuario Estándar:
├─ Email: luis@gmail.com
├─ Password: luis2025
└─ Rol: user

Usuario Admin:
├─ Email: andrusaguila@gmail.com
├─ Password: andrew2025
└─ Rol: admin
```

### 7.3 Instrucciones de Acceso

1. Abre la URL del frontend en navegador
2. Haz clic en **"Sign In"**
3. Ingresa credenciales de prueba
4. Navega a un juego
5. Visualiza ranking y envía tu puntaje

**Captura de pantalla - Login:**

[INSERTAR AQUÍ CAPTURA DE LA PANTALLA DE LOGIN]

---

## 8. CONCLUSIONES Y RESULTADOS

✅ **Objetivos Alcanzados:**

1. **Dos pantallas principales implementadas:**
   - ✅ Lista de juegos con datos GET del backend
   - ✅ Detalle del juego con ranking y formulario POST

2. **Validaciones completas:**
   - ✅ Frontend: Zod schemas con mensajes claros
   - ✅ Backend: Doble validación para seguridad
   - ✅ UI: Toast notifications y inline errors

3. **Diseño personalizado:**
   - ✅ Paleta retro arcade (púrpura/rosa/neón)
   - ✅ Componentes reutilizables con Radix UI
   - ✅ Responsive en móvil/tablet/desktop
   - ✅ Tipografía temática pixelada

4. **Funcionalidad completa:**
   - ✅ Autenticación JWT
   - ✅ Ranking global en tiempo real
   - ✅ Comentarios públicos
   - ✅ Panel administrativo
   - ✅ Datos de prueba realistas

✅ **Tecnologías Modernas:**
- TypeScript para type-safety
- React Hooks para state management
- Tailwind CSS para estilos rápidos
- Zod para validación
- Express + MySQL para backend robusto

---

## 9. ANEXOS

### 9.1 Estructura de Componentes

```
src/components/
├── HomePage.tsx           [Lista de juegos - GET]
├── GamePage.tsx           [Detalle juego + formulario - POST]
├── GameCard.tsx           [Tarjeta de juego individual]
├── GameControls.tsx       [Controles del juego]
├── RankingsPage.tsx       [Vista de rankings]
├── RankingNameModal.tsx   [Modal para cambiar nombre]
├── AuthModal.tsx          [Login/Register]
├── Navbar.tsx             [Barra de navegación]
├── ProfilePage.tsx        [Perfil de usuario]
├── AdminPage.tsx          [Panel administrativo]
├── PixelBackground.tsx    [Fondo temático]
└── games/
    ├── SnakeGame.tsx      [Juego Snake interactivo]
    ├── PongGame.tsx       [Juego Pong interactivo]
    └── TetrisGame.tsx     [Juego Tetris interactivo]
```

### 9.2 Variables de Entorno

**Frontend (.env o Vercel):**
```
VITE_API_URL=https://retroarcades-production.up.railway.app
```

**Backend (.env o Railway Variables):**
```
MYSQL_PUBLIC_URL=mysql://root:...@yamabiko.proxy.rlwy.net:36307/railway
JWT_SECRET=17a99556c13e1ae039257d264e4df629a31e28ce0980fcac4dd6dcb0f4d54608
NODE_ENV=production
CORS_ORIGIN=https://retro-arcades.vercel.app
```

### 9.3 Logs de Consola Relevantes

Al iniciar el backend se ve:
```
[Startup] CORS_ORIGIN permitidos: [ 'https://retro-arcades.vercel.app' ]
API listening on http://localhost:8080
```

---

**Documento generado:** 23 de Noviembre de 2025

**Estudiante:** Andrew Aguila

**Docente:** [NOMBRE DEL DOCENTE]

---
