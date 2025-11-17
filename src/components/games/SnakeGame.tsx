import { useEffect, useRef, useState, useCallback } from 'react';
import { GameControls } from '../GameControls';
import { Countdown } from '../Countdown';

interface SnakeGameProps {
  onGameOver: (score: number) => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

export function SnakeGame({ onGameOver }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const snake = useRef<Position[]>([{ x: 10, y: 10 }]);
  const direction = useRef<Direction>('RIGHT');
  const nextDirection = useRef<Direction>('RIGHT');
  const food = useRef<Position>({ x: 15, y: 15 });
  const gameLoop = useRef<number>();

  const GRID_SIZE = 20;
  const CELL_SIZE = 20;
  const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.current.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food.current = newFood;
  }, []);

  const resetGame = useCallback(() => {
    snake.current = [{ x: 10, y: 10 }];
    direction.current = 'RIGHT';
    nextDirection.current = 'RIGHT';
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(false);
    generateFood();
  }, [generateFood]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar el canvas con un gradiente
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_SIZE);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(1, '#1a1a35');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Dibujar la cuadrícula con efecto de brillo
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Dibujar la serpiente con efectos mejorados
    snake.current.forEach((segment, index) => {
      const x = segment.x * CELL_SIZE;
      const y = segment.y * CELL_SIZE;
      
      if (index === 0) {
        // Cabeza con gradiente y brillo
        const headGradient = ctx.createRadialGradient(
          x + CELL_SIZE / 2, y + CELL_SIZE / 2, 0,
          x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2
        );
        headGradient.addColorStop(0, '#10b981');
        headGradient.addColorStop(1, '#059669');
        ctx.fillStyle = headGradient;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#10b981';
      } else {
        // Cuerpo con gradiente
        const bodyGradient = ctx.createLinearGradient(x, y, x + CELL_SIZE, y + CELL_SIZE);
        bodyGradient.addColorStop(0, '#34d399');
        bodyGradient.addColorStop(1, '#10b981');
        ctx.fillStyle = bodyGradient;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#10b981';
      }
      
      ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      
      // Ojos de la cabeza con brillo
      if (index === 0) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        const eyeSize = 4;
        const pupilSize = 2;
        
        let eye1X = x + 6, eye1Y = y + 6;
        let eye2X = x + 6, eye2Y = y + 12;
        
        if (direction.current === 'RIGHT') {
          eye1X = x + 14; eye2X = x + 14;
        } else if (direction.current === 'LEFT') {
          eye1X = x + 4; eye2X = x + 4;
        } else if (direction.current === 'UP') {
          eye1X = x + 6; eye2X = x + 12;
          eye1Y = y + 4; eye2Y = y + 4;
        } else {
          eye1X = x + 6; eye2X = x + 12;
          eye1Y = y + 14; eye2Y = y + 14;
        }
        
        // Ojos blancos
        ctx.fillRect(eye1X, eye1Y, eyeSize, eyeSize);
        ctx.fillRect(eye2X, eye2Y, eyeSize, eyeSize);
        
        // Pupilas negras
        ctx.fillStyle = '#000';
        ctx.fillRect(eye1X + 1, eye1Y + 1, pupilSize, pupilSize);
        ctx.fillRect(eye2X + 1, eye2Y + 1, pupilSize, pupilSize);
      }
    });
    ctx.shadowBlur = 0;

    // Dibujar la comida con animación y brillo
    const foodX = food.current.x * CELL_SIZE;
    const foodY = food.current.y * CELL_SIZE;
    const pulse = Math.sin(Date.now() / 200) * 2 + 2;
    
    ctx.shadowBlur = 15 + pulse;
    ctx.shadowColor = '#ef4444';
    
    const foodGradient = ctx.createRadialGradient(
      foodX + CELL_SIZE / 2, foodY + CELL_SIZE / 2, 0,
      foodX + CELL_SIZE / 2, foodY + CELL_SIZE / 2, CELL_SIZE / 2
    );
    foodGradient.addColorStop(0, '#fca5a5');
    foodGradient.addColorStop(0.5, '#ef4444');
    foodGradient.addColorStop(1, '#dc2626');
    ctx.fillStyle = foodGradient;
    
    ctx.beginPath();
    ctx.arc(foodX + CELL_SIZE / 2, foodY + CELL_SIZE / 2, (CELL_SIZE - 4) / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
  }, []);

  const update = useCallback(() => {
    direction.current = nextDirection.current;
    
    const head = { ...snake.current[0] };
    
    switch (direction.current) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    // Verificar colisión con las paredes
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameOver(true);
      return false;
    }

    // Verificar colisión consigo misma
    if (snake.current.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      return false;
    }

    snake.current.unshift(head);

    // Verificar colisión con la comida
    if (head.x === food.current.x && head.y === food.current.y) {
      setScore(prev => prev + 10);
      generateFood();
    } else {
      snake.current.pop();
    }

    return true;
  }, [generateFood]);

  useEffect(() => {
    if (!gameStarted || isPaused || gameOver) {
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current);
      }
      draw();
      return;
    }

    let lastTime = 0;
    const fps = Math.max(5, 10 - Math.floor(score / 50));
    const interval = 1000 / fps;

    const animate = (currentTime: number) => {
      gameLoop.current = requestAnimationFrame(animate);
      
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= interval) {
        lastTime = currentTime - (deltaTime % interval);
        
        if (update()) {
          draw();
        } else {
          if (gameLoop.current) {
            cancelAnimationFrame(gameLoop.current);
          }
        }
      }
    };

    gameLoop.current = requestAnimationFrame(animate);

    return () => {
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current);
      }
    };
  }, [gameStarted, isPaused, gameOver, score, update, draw]);

  useEffect(() => {
    if (gameOver) {
      onGameOver(score);
    }
    // Importante: solo reaccionar al cambio de gameOver para evitar múltiples llamadas
  }, [gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || isPaused || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (direction.current !== 'DOWN') nextDirection.current = 'UP';
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (direction.current !== 'UP') nextDirection.current = 'DOWN';
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (direction.current !== 'RIGHT') nextDirection.current = 'LEFT';
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (direction.current !== 'LEFT') nextDirection.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, isPaused, gameOver]);

  const handleStart = () => {
    if (gameOver) {
      resetGame();
    }
    setShowCountdown(true);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setGameStarted(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    resetGame();
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-3 sm:gap-4">
      <div className="flex items-center justify-between w-full max-w-[400px] px-2">
        <div className="text-white text-sm sm:text-base" style={{ fontFamily: 'monospace' }}>
          PUNTOS: <span className="text-green-400" style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.8)' }}>{score}</span>
        </div>
        {isPaused && (
          <div className="text-yellow-400 animate-pulse text-sm sm:text-base" style={{ fontFamily: 'monospace' }}>
            PAUSADO
          </div>
        )}
      </div>

      <GameControls
        isPlaying={gameStarted}
        isPaused={isPaused}
        isFullscreen={isFullscreen}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onFullscreen={handleFullscreen}
      />
      
      <div className="relative w-full flex justify-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-2 sm:border-4 border-green-500 rounded max-w-full h-auto"
          style={{
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.6)',
            imageRendering: 'pixelated',
            width: '100%',
            maxWidth: '400px',
            aspectRatio: '1/1'
          }}
        />
        
        {showCountdown && <Countdown onComplete={handleCountdownComplete} />}
        
        {!gameStarted && !gameOver && !showCountdown && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded">
            <div className="text-center px-4">
              <p className="text-white mb-2 text-sm sm:text-base" style={{ fontFamily: 'monospace' }}>
                Presiona INICIAR para comenzar
              </p>
            </div>
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded">
            <div className="text-center px-4">
              <p className="text-red-400 mb-2 text-base sm:text-lg animate-pulse" style={{ 
                fontFamily: 'monospace',
                textShadow: '0 0 20px rgba(239, 68, 68, 0.8)'
              }}>
                ¡GAME OVER!
              </p>
              <p className="text-white mb-3 sm:mb-4 text-sm sm:text-base" style={{ fontFamily: 'monospace' }}>
                Puntuación: <span className="text-green-400">{score}</span>
              </p>
              <p className="text-gray-300 text-xs sm:text-sm" style={{ fontFamily: 'monospace' }}>
                Presiona INICIAR para jugar de nuevo
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
