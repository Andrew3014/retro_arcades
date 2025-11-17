
  # Retro Gaming Web App (Fullstack)

  Aplicación para jugar títulos retro (Snake, Pong, Tetris), conocer su historia/creadores y competir en rankings globales con autenticación, comentarios públicos, reportes privados y panel de administración.

  ## Descripción del sistema

  - Módulo principal: gestión de puntajes (scores) por juego.
    - Create (POST): registrar puntaje tras cada partida.
    - Read (GET): consultar rankings globales y el historial de partidas.
    - Update (PUT): editar nombre a mostrar en ranking por juego (perfil) y (admin) ajustar puntaje.
    - Delete (DELETE): eliminación lógica de puntajes (admin).
  - Autenticación JWT con roles (usuario/admin).
  - Rankings por juego (mejor puntaje por usuario y posición) y récord personal con aviso si mejoras tu marca.
  - Nombre de ranking por juego: el usuario lo define la primera vez y luego lo edita desde Perfil.
  - Historial de partidas del usuario.
  - Comentarios públicos por juego y reportes privados para el admin.
  - Panel Admin: gestionar comentarios, reportes y puntajes.

  ## Estructura

  - `src/` Frontend React + Vite.
  - `server/` API Express + MySQL.
    - `routes/`: `auth`, `games`, `me`, `admin`.
    - `sql/schema.sql`: esquema y datos iniciales.

  ## Requisitos previos

  - Node.js 18+
  - MySQL Server y MySQL Workbench

  ## Configuración de la base de datos (MySQL Workbench)

  1) Abrir MySQL Workbench y ejecutar el script:

     - Archivo: `server/sql/schema.sql`
     - Esto creará la BD `retro_gaming`, tablas y seeds (3 juegos + registros mínimos).
     - Nota: el usuario admin seeded tiene un hash dummy. Puedes crear un admin así:

     a. Registra un usuario via API (o `AuthModal`).

     b. Promuévelo a admin con SQL:

     ```sql
     USE retro_gaming;
     UPDATE users SET role = 'admin' WHERE email = 'tu_correo@dominio.com';
     ```

  2) Crea el archivo `server/.env` copiando desde `.env.example` y ajusta credenciales:

  ```
  PORT=4000
  JWT_SECRET=pon_un_secreto_largo
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=tu_password
  DB_NAME=retro_gaming
  CORS_ORIGIN=http://localhost:5173
  ```

  ## Instalación y ejecución

  Instala dependencias:

  ```
  npm install
  ```

  Arranca la API (puerto 4000 por defecto):

  ```
  npm run server:dev
  ```

  Arranca el frontend (Vite en 5173):

  ```
  npm run dev
  ```

  Asegúrate de exponer en el frontend la URL de la API (opcional si usas localhost):

  ```
  VITE_API_URL=http://localhost:4000
  ```

  ## Endpoints principales (resumen)

  - Auth: `POST /auth/register`, `POST /auth/login`.
  - Juegos: `GET /games`, `GET /games/:slug`, `GET /games/:slug/rankings`, `POST /games/:slug/scores`.
  - Perfil: `GET /me`, `GET /me/scores`, `PUT /me/ranking-name`.
  - Comentarios: `GET /games/:slug/comments`, `POST /games/:slug/comments`.
  - Reportes: `POST /games/:slug/reports`.
  - Admin: `GET /admin/overview`, `GET /admin/comments`, `DELETE /admin/comments/:id`, `GET /admin/reports`, `PUT /admin/reports/:id`, `GET /admin/scores`, `PUT /admin/scores/:id`, `DELETE /admin/scores/:id`.

  Validación de datos en backend con Zod y SQL parametrizado (mysql2/promise).

  ## Registro de 5+ inserciones exitosas

  - Seeds crean 3 juegos y puntajes iniciales. Puedes registrar usuarios nuevos (registrando 2+ usuarios y enviando sus puntajes desde la UI) para superar 5 inserciones.

  ## Notas de integración UI

  - `AuthModal` ya usa la API para registro/login y guarda JWT en `localStorage`.
  - `GamePage` ahora envía puntajes a la API, muestra ranking global y permite comentar/reportar.
  - `RankingsPage` consulta rankings desde la API.
  - `ProfilePage` permite editar el nombre de ranking por juego y ver historial.
  - `AdminPage` modera comentarios/reportes y gestiona puntajes.
  