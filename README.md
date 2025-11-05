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






