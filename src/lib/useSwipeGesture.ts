import { useEffect, useRef } from 'react';

export interface SwipeGestureConfig {
  minDistance?: number; // Distancia mínima para detectar swipe (en píxeles)
  maxDuration?: number; // Duración máxima para detectar swipe (en ms)
}

export interface SwipeHandlers {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

/**
 * Hook personalizado para detectar gestos de swipe (deslizamiento táctil)
 * Útil para controlar juegos en dispositivos móviles
 * @param handlers Objeto con callbacks para cada dirección de swipe
 * @param config Configuración de sensibilidad
 */
export function useSwipeGesture(
  handlers: SwipeHandlers,
  config: SwipeGestureConfig = {}
) {
  const {
    minDistance = 30, // Mínimo 30px de movimiento
    maxDuration = 500, // Máximo 500ms entre touch start y end
  } = config;

  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches.length) return;

      const touch = e.changedTouches[0];
      const { x: startX, y: startY, time: startTime } = touchStartRef.current;
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const duration = endTime - startTime;

      // Validar duración
      if (duration > maxDuration) return;

      // Detectar dirección según el movimiento mayor
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
      const isVertical = Math.abs(deltaY) > Math.abs(deltaX);

      if (isHorizontal && Math.abs(deltaX) > minDistance) {
        if (deltaX > 0) {
          // Swipe hacia la derecha
          handlers.onSwipeRight?.();
        } else {
          // Swipe hacia la izquierda
          handlers.onSwipeLeft?.();
        }
      } else if (isVertical && Math.abs(deltaY) > minDistance) {
        if (deltaY > 0) {
          // Swipe hacia abajo
          handlers.onSwipeDown?.();
        } else {
          // Swipe hacia arriba
          handlers.onSwipeUp?.();
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart, false);
      document.removeEventListener('touchend', handleTouchEnd, false);
    };
  }, [handlers, minDistance, maxDuration]);
}
