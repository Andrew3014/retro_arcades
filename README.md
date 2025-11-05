# Retro Arcade

Retro Arcade es una landing demo con una colección de juegos clásicos implementados con HTML5, CSS3 y JavaScript (sin librerías externas). Está pensada como prototipo educativo para jugar, probar implementaciones sencillas y conocer una breve historia de cada juego.

## Objetivo

- Jugar y probar versiones simples de juegos retro (Snake, Pong, Breakout, Flappy Bird y Simon).
- Aprender patrones básicos de desarrollo de juegos en el navegador (bucles, entrada, colisiones, scoring).
- Conocer brevemente el origen histórico de cada juego mientras se juega.

## Estructura del repositorio

- `index.html` — Página principal con tarjetas por juego y controles (Jugar / Detener).
- `styles.css` — Estilos, variables de tema, efectos neón y responsive.
- `scripts.js` — Lógica del background (partículas), los 5 juegos y `GameController` (start/stop, bloqueo de scroll durante juegos).
- `docs/diagrams/` — Diagramas de arquitectura (PlantUML `.puml`) — opcional.

## Cómo ejecutar localmente

La aplicación es estática. Lo ideal es servirla con un pequeño servidor local para evitar limitaciones de navegador.

PowerShell (recomendado si tienes Python instalado):

```powershell
# desde la carpeta del proyecto
python -m http.server 8000
# abrir http://localhost:8000 en el navegador
```

Alternativas:
- Live Server (VSCode)
- `serve` (Node): `npm i -g serve` y `serve . -l 8000`

## Controles por juego

- Snake: Flechas o WASD
- Pong: Paleta izquierda: W/S. Paleta derecha: 8 (o Numpad8) arriba y 2 (o Numpad2) abajo.
- Breakout: Flechas izquierda/derecha
- Flappy Bird: Clic o Barra Espaciadora
- Simon: Clic en los botones de color

## Comportamiento de la UI

- Mientras un juego está activo el scroll de la página queda desactivado para evitar que las teclas de control (flechas/espacio) desplacen el viewport.
- Cada tarjeta incluye botones "Jugar" y "Detener". Solo un juego puede estar activo a la vez (`GameController`).

## Desarrollo y estructura de código

- `scripts.js` contiene: inicialización de partículas, funciones `initSnake()`, `initPong()`, `initBreakout()`, `initFlappy()`, `initSimon()` y el `GameController` que expone `window.GameController.start(name)` / `.stop(name)`.
- Los init actuales exponen stops globales (`window.__<game>_stop`) y algunos exponen start (`window.__<game>_start`). El controlador maneja un fallback al dispatcher global `startGame(name)` si es necesario.

## Diagnóstico rápido

1. Si un juego no inicia: abre la consola del navegador (F12) y revisa errores JS.
2. Si algo responde lentamente: revisa el uso de CPU (partículas o intervalos frecuentes).
3. Si las teclas mueven la página: asegúrate de que el juego está activo (el bloqueo de scroll solo se aplica mientras un juego está activo).

## Contribuir

Pull requests y mejoras son bienvenidas. Ideas prioritarias:
- Guardado local de leaderboards y perfiles (localStorage).
- Separar juegos en módulos JS y añadir tests.
- Mejoras en accesibilidad (roles ARIA, focus visible, navegación por teclado completa).

## Publicar en GitHub (comandos de PowerShell)

Si ya creaste el repositorio remoto `https://github.com/Andrew3014/retro_arcade.git`, aquí tienes los pasos para subir el contenido desde tu máquina:

```powershell
# inicializar (si no está inicializado)
git init
git add .
git commit -m "Initial: Retro Arcade static site"

# conectar el remoto y pushear a main
git remote add origin https://github.com/Andrew3014/retro_arcade.git
git branch -M main
git push -u origin main
```

### Notas sobre autenticación

- Si usas HTTPS, GitHub pedirá credenciales. Recomendado: usar un Personal Access Token (PAT) con permisos `repo` y usarlo como contraseña cuando Git lo solicite.
- Alternativa (recomendada si trabajas frecuentemente): configurar SSH keys y usar la URL `git@github.com:Andrew3014/retro_arcade.git`.

Si quieres que prepare un script `publish.ps1` que lea el token desde la variable de entorno `GH_TOKEN` y haga push automátizado, dímelo y lo agrego.

## Licencia

Proyecto educativo — libre para usar y modificar. Puedo añadir `LICENSE` (MIT) si quieres.

---

Si quieres que haga el push desde este entorno (ejecutar los comandos aquí), confirma el método de autenticación (SSH configurado o quieres usar un PAT). Por seguridad no incluyas el token en el chat; si prefieres, ejecuto los comandos y te pido autorización previa antes de intentar cualquier push remoto.
# Retro Arcade - Landing de juegos clásicos

Proyecto simple que reúne 5 juegos clásicos implementados únicamente con HTML, CSS y JavaScript (sin librerías externas). Está diseñado con una estética gamer de los 80/90 para una experiencia retro.

Contenido
- `index.html`: Estructura de la landing, secciones para cada juego, canvas y botones.
- `styles.css`: Estilos con paleta neón y layout responsive.
- `scripts.js`: Lógica de los 5 juegos: Snake, Pong, Breakout, Flappy (versión simple) y Simon Says.

Cómo usar
1. Abrir `index.html` en un navegador moderno.
2. Interactuar con cada juego en su tarjeta.

Explicación por partes

1) Estructura general (`index.html`)
- Header con logo y navegación.
- Sección `#games` con 5 `article.game-card`, cada uno contiene un `canvas` (o tablero DOM para Simon) y una caja `.info` con historia, tecnología y controles.

2) Estilos (`styles.css`)
- Uso de variables CSS para colores neón.
- Grid responsivo para las tarjetas de juego.
- Efecto de cuadrícula retro mediante pseudo-elemento en `body::before`.

3) Lógica de los juegos (`scripts.js`) — resumen y detalles
- Snake: Canvas, celda de 20px, movimiento por dirección, manzana aleatoria, envolvimiento en bordes, reinicio en colisión con cuerpo.
- Pong: Dos paletas controladas por W/S y flechas, bola con rebotes y reinicio tras fallo.
- Breakout: Ladrillos en filas, bola rebotando, paleta controlada por flechas, eliminación de ladrillos al colisionar.
- Flappy: Pájaro con física simple (gravedad y flap), generación periódica de tuberías y reinicio al choque o salirse.
- Simon Says: Secuencia de colores en DOM, reproducción de secuencia y comprobación de entradas de usuario.

Consideraciones y siguientes pasos sugeridos
- Mejorar detección de colisiones y añadir marcadores/puntuaciones.
- Añadir menú para pausar/reiniciar cada juego.
- Exportar cada juego a su propio archivo JS para mayor mantenimiento.

## Para tu ingeniero
Si vas a presentar este proyecto a un ingeniero o colega, aquí hay un resumen claro y rápido para dejar todo entendible:

- Propósito: demo educativa con 5 juegos clásicos implementados con tecnologías web básicas para aprendizaje (Snake, Pong, Breakout, Flappy, Simon).
- Tecnologías: HTML5 (estructura y elementos), CSS3 (estilos, variables y efectos), JavaScript (vanilla) y Canvas 2D API. No se usan librerías externas.
- Estructura principal de archivos:
	- `index.html` — landing con tarjetas para cada juego y controles.
	- `styles.css` — tema retro / neón, layout, efectos Uiverse-like y responsive.
	- `scripts.js` — lógica de partículas y de los 5 juegos. Funciones exportadas globalmente:
		- `window.__snake_start`, `window.__pong_start`, `window.__breakout_start`, `window.__flappy_start`, `window.__simon_start`

- Cómo ejecutar localmente (rápido):
	- Usar Live Server (VSCode) o servir con Python (PowerShell):

```powershell
# desde el directorio del proyecto
python -m http.server 8000
# luego abrir http://localhost:8000 en el navegador
```

- Qué revisar/qué esperar durante la presentación:
	- Abrir la página y mostrar las tarjetas de juegos. Presionar 'Jugar' en cada tarjeta para iniciar la demo.
	- Mostrar que los juegos usan Canvas (gráficos) y DOM (Simon). Explicar que las funciones `window.__*` permiten arrancar los juegos desde la UI o pruebas.
	- Explicar el toggle de tema (oscuro/claro) almacenado en `localStorage` y cómo afecta estilos (.light en `html`).

- Notas de mantenimiento y mejoras sugeridas:
	- Separar cada juego en su propio archivo JS para facilitar tests y mantenimiento.
	- Añadir una API mínima `start()`/`stop()` en cada juego para controlar el estado (actualmente algunas `start()` exponen `stop()` internamente pero no están centralizadas).
	- Agregar tests unitarios (por ejemplo, validar lógica de colisiones) y/o una pequeña suite de integración manual.

- Mensaje breve para tu ingeniero (ejemplo):
	"Te comparto una landing demo llamada Retro Arcade con 5 juegos implementados en HTML/CSS/JS. Está pensada como prototipo educativo. Los archivos clave son `index.html`, `styles.css` y `scripts.js`. Para correrlo localmente basta con un servidor estático. Si quieres, puedo separarlos en módulos y añadir pruebas y un pequeño build. ¿Te interesa que cree issues para las mejoras prioritarias?"

Licencia
Proyecto educativo — libre para usar y modificar.
