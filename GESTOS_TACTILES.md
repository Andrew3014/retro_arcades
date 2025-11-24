# 📱 Gestos Táctiles de Swipe - Guía de Uso

## ¿Qué es?

Los **gestos de swipe** (deslizamiento táctil) permiten controlar los juegos deslizando el dedo en la pantalla del celular, sin necesidad de tocar los botones.

## 🎮 Cómo Funcionan en Cada Juego

### Snake (Serpiente)
Desliza el dedo en cualquier dirección:
- **Deslizar hacia arriba** ⬆️ → La serpiente sube
- **Deslizar hacia abajo** ⬇️ → La serpiente baja
- **Deslizar hacia izquierda** ⬅️ → La serpiente va a la izquierda
- **Deslizar hacia derecha** ➡️ → La serpiente va a la derecha

> **Distancia mínima:** 30 píxeles
> **Tiempo máximo:** 500 ms

### Pong (Ping Pong)
Tu paleta es la del lado izquierdo:
- **Deslizar hacia arriba** ⬆️ → La paleta sube
- **Deslizar hacia abajo** ⬇️ → La paleta baja

> **Distancia mínima:** 20 píxeles (más sensible)
> **Tiempo máximo:** 400 ms

### Tetris
Controla la pieza cayente:
- **Deslizar hacia izquierda** ⬅️ → La pieza se mueve a la izquierda
- **Deslizar hacia derecha** ➡️ → La pieza se mueve a la derecha
- **Deslizar hacia arriba** ⬆️ → La pieza rota
- **Deslizar hacia abajo** ⬇️ → La pieza cae más rápido

> **Distancia mínima:** 25 píxeles
> **Tiempo máximo:** 500 ms

## 🛠️ Implementación Técnica

### Hook Personalizado: `useSwipeGesture`

Se creó un hook React personalizado en `src/lib/useSwipeGesture.ts` que detecta gestos de swipe.

**Características:**
- Detecta movimiento táctil (touch start y touch end)
- Calcula la dirección según el desplazamiento
- Configurable: distancia mínima y duración máxima
- Compatible con dispositivos táctiles (teléfonos, tablets)

**Uso básico:**
```typescript
useSwipeGesture({
  onSwipeUp: () => { /* hacer algo */ },
  onSwipeDown: () => { /* hacer algo */ },
  onSwipeLeft: () => { /* hacer algo */ },
  onSwipeRight: () => { /* hacer algo */ },
}, { 
  minDistance: 30,  // píxeles
  maxDuration: 500  // milisegundos
});
```

### Archivos Modificados

- `src/lib/useSwipeGesture.ts` - **Nuevo**: Hook para detección de swipes
- `src/components/games/SnakeGame.tsx` - Integración de gestos de swipe
- `src/components/games/PongGame.tsx` - Integración de gestos de swipe
- `src/components/games/TetrisGame.tsx` - Integración de gestos de swipe

## 📊 Validaciones

Todos los swipes incluyen validaciones:
- ✅ Solo funcionan cuando el juego está **iniciado**
- ✅ Se ignoran si el juego está **pausado**
- ✅ Se ignoran si el juego está en **game over**
- ✅ En Snake: valida dirección opuesta (no dejar que la serpiente colisione consigo misma)
- ✅ En Pong: limita el movimiento dentro de los bordes
- ✅ En Tetris: valida colisiones antes de mover la pieza

## 🚀 Mejora de UX en Celular

Ahora tienes **dos formas** de controlar cada juego:

1. **Botones táctiles** (MobileControls) - Más preciso, visible
2. **Gestos de swipe** - Más intuitivo, menos botones

Esto proporciona una experiencia óptima en dispositivos móviles.

## ⚡ Sensibilidad

Cada juego tiene diferentes configuraciones para optimizar la experiencia:

| Juego | Distancia Min | Duración Max | Razón |
|-------|---------------|--------------|-------|
| Snake | 30px | 500ms | Movimientos normales y rápidos |
| Pong | 20px | 400ms | Movimientos más sensibles |
| Tetris | 25px | 500ms | Balance entre rapidez y control |

## 🎯 Próximas Mejoras (Opcional)

- [ ] Agregar retroalimentación visual (ripple effect) al detectar swipe
- [ ] Sonidos de confirmación de gestos
- [ ] Configuración de sensibilidad personalizada
- [ ] Soporte para multitoque (dos dedos)

---

**¡Prueba los gestos en un celular ahora!** 📱
