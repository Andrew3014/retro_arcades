# Script de Seed - Usuarios de Prueba

Este script agrega 10 usuarios de prueba + 1 admin al proyecto Retro Gaming Web App.

## Usuarios Creados

### Usuarios de Prueba (10)
| Email | Usuario | Contraseña | Puntajes |
|-------|---------|-----------|----------|
| luis@gmail.com | luis14 | luis2025 | Snake:8, Pong:6, Tetris:9 |
| maria@gmail.com | maria25 | maria2025 | Snake:7, Pong:5, Tetris:8 |
| carlos@gmail.com | carlos33 | carlos2025 | Snake:9, Pong:4, Tetris:7 |
| ana@gmail.com | ana42 | ana2025 | Snake:6, Pong:8, Tetris:5 |
| juan@gmail.com | juan51 | juan2025 | Snake:5, Pong:9, Tetris:6 |
| sofia@gmail.com | sofia19 | sofia2025 | Snake:4, Pong:7, Tetris:9 |
| diego@gmail.com | diego77 | diego2025 | Snake:8, Pong:3, Tetris:8 |
| laura@gmail.com | laura88 | laura2025 | Snake:7, Pong:6, Tetris:4 |
| pedro@gmail.com | pedro99 | pedro2025 | Snake:9, Pong:5, Tetris:7 |
| isabel@gmail.com | isabel44 | isabel2025 | Snake:6, Pong:8, Tetris:3 |

### Usuario Admin
| Email | Usuario | Contraseña | Rol |
|-------|---------|-----------|-----|
| andrusaguila@gmail.com | andrew30 | andrew2025 | admin |

## Cómo Ejecutar

### Opción 1: MySQL Workbench
1. Abre MySQL Workbench
2. Conecta a tu base de datos Railway
3. Abre el archivo `seed_test_users.sql` (File → Open SQL Script)
4. Ejecuta (Ctrl+Shift+Enter o botón ⚡)

### Opción 2: Comando CLI
```bash
mysql -h yamabiko.proxy.rlwy.net -P 36307 -u root -pRZQJaKlKZPyScQSARuScxGGWCIxjTQDe railway < seed_test_users.sql
```

### Opción 3: PowerShell con Docker
```powershell
docker run --rm -v "${PWD}/seed_test_users.sql:/sql/seed.sql" mysql:8.0 sh -c "mysql -h yamabiko.proxy.rlwy.net -P 36307 -u root -pRZQJaKlKZPyScQSARuScxGGWCIxjTQDe railway < /sql/seed.sql"
```

## Datos Incluidos

✅ 10 usuarios de prueba con contraseña [nombre]2025
✅ 1 usuario admin (andrew30)
✅ 30 scores (3 por usuario, todos < 10)
✅ 11 ranking_names personalizados
✅ 11 comentarios de prueba

## Para Verificar

Una vez ejecutado, abre la app y:

1. **Login con cualquier usuario:**
   - Email: luis@gmail.com
   - Password: luis2025

2. **Ve a cualquier juego y verás el ranking con los 10 usuarios**

3. **Login como admin:**
   - Email: andrusaguila@gmail.com
   - Password: andrew2025
   - Acceso a panel admin

## Notas

- Los puntajes están diseñados para ser pequeños (< 10) como solicitaste
- Cada usuario tiene un ranking_name personalizado
- Los comentarios incluyen variedad de opiniones sobre los juegos
- El admin tiene puntajes iguales en los 3 juegos (pueden editarse si necesario)

**Fecha de creación:** 23 de Noviembre 2025
