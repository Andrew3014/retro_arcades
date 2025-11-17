import { useEffect, useRef, useState, useCallback } from 'react';
import { GameControls } from '../GameControls';
import { Countdown } from '../Countdown';

interface PongGameProps {
  onGameOver: (score: number) => void;
}

export function PongGame({ onGameOver }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string>('');
  const [showCountdown, setShowCountdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 80;
  const BALL_SIZE = 10;
  const WINNING_SCORE = 11;

  const paddle1Y = useRef(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const paddle2Y = useRef(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const ballX = useRef(CANVAS_WIDTH / 2);
  const ballY = useRef(CANVAS_HEIGHT / 2);
  const ballSpeedX = useRef(4);
  const ballSpeedY = useRef(3);
  const keys = useRef<Set<string>>(new Set());
  const gameLoop = useRef<number>();

  const resetBall = useCallback(() => {
    ballX.current = CANVAS_WIDTH / 2;
    ballY.current = CANVAS_HEIGHT / 2;
    ballSpeedX.current = (Math.random() > 0.5 ? 1 : -1) * 4;
    ballSpeedY.current = (Math.random() - 0.5) * 6;
  }, []);

  const resetGame = useCallback(() => {
    setScore({ player1: 0, player2: 0 });
    paddle1Y.current = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    paddle2Y.current = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    resetBall();
    setGameOver(false);
    setWinner('');
    setIsPaused(false);
    setGameStarted(false);
  }, [resetBall]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar el canvas con un gradiente
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(0.5, '#0a0a1a');
    gradient.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Dibujar la línea central con efecto de brillo
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([15, 15]);
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    // Dibujar la paleta 1 con gradiente y brillo
    const paddle1Gradient = ctx.createLinearGradient(20, 0, 20 + PADDLE_WIDTH, 0);
    paddle1Gradient.addColorStop(0, '#60a5fa');
    paddle1Gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = paddle1Gradient;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#3b82f6';
    ctx.fillRect(20, paddle1Y.current, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Dibujar la paleta 2 con gradiente y brillo
    const paddle2Gradient = ctx.createLinearGradient(CANVAS_WIDTH - 20 - PADDLE_WIDTH, 0, CANVAS_WIDTH - 20, 0);
    paddle2Gradient.addColorStop(0, '#ef4444');
    paddle2Gradient.addColorStop(1, '#fca5a5');
    ctx.fillStyle = paddle2Gradient;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ef4444';
    ctx.fillRect(CANVAS_WIDTH - 20 - PADDLE_WIDTH, paddle2Y.current, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Dibujar la pelota con brillo y estela
    const ballGradient = ctx.createRadialGradient(
      ballX.current, ballY.current, 0,
      ballX.current, ballY.current, BALL_SIZE
    );
    ballGradient.addColorStop(0, '#ffffff');
    ballGradient.addColorStop(0.5, '#f0f0f0');
    ballGradient.addColorStop(1, '#a0a0a0');
    ctx.fillStyle = ballGradient;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#fff';
    ctx.beginPath();
    ctx.arc(ballX.current, ballY.current, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Dibujar los marcadores con brillo
    ctx.font = 'bold 48px monospace';
    ctx.shadowBlur = 15;
    
    ctx.fillStyle = '#3b82f6';
    ctx.shadowColor = '#3b82f6';
    ctx.fillText(score.player1.toString(), CANVAS_WIDTH / 4, 60);
    
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.fillText(score.player2.toString(), (CANVAS_WIDTH * 3) / 4, 60);
    
    ctx.shadowBlur = 0;
  }, [score]);

  const update = useCallback(() => {
    // Mover las paletas
    const paddleSpeed = 6;
    if (keys.current.has('w') && paddle1Y.current > 0) {
      paddle1Y.current -= paddleSpeed;
    }
    if (keys.current.has('s') && paddle1Y.current < CANVAS_HEIGHT - PADDLE_HEIGHT) {
      paddle1Y.current += paddleSpeed;
    }
    if (keys.current.has('ArrowUp') && paddle2Y.current > 0) {
      paddle2Y.current -= paddleSpeed;
    }
    if (keys.current.has('ArrowDown') && paddle2Y.current < CANVAS_HEIGHT - PADDLE_HEIGHT) {
      paddle2Y.current += paddleSpeed;
    }

    // Mover la pelota
    ballX.current += ballSpeedX.current;
    ballY.current += ballSpeedY.current;

    // Colisión de la pelota con techo o suelo
    if (ballY.current <= 0 || ballY.current >= CANVAS_HEIGHT) {
      ballSpeedY.current *= -1;
    }

    // Colisión de la pelota con las paletas
    if (
      ballX.current <= 30 + PADDLE_WIDTH &&
      ballY.current >= paddle1Y.current &&
      ballY.current <= paddle1Y.current + PADDLE_HEIGHT
    ) {
      ballSpeedX.current = Math.abs(ballSpeedX.current) * 1.05;
      ballSpeedY.current += (Math.random() - 0.5) * 2;
    }

    if (
      ballX.current >= CANVAS_WIDTH - 30 - PADDLE_WIDTH &&
      ballY.current >= paddle2Y.current &&
      ballY.current <= paddle2Y.current + PADDLE_HEIGHT
    ) {
      ballSpeedX.current = -Math.abs(ballSpeedX.current) * 1.05;
      ballSpeedY.current += (Math.random() - 0.5) * 2;
    }

    // Sumar puntos
    if (ballX.current < 0) {
      setScore(prev => {
        const newScore = { ...prev, player2: prev.player2 + 1 };
        if (newScore.player2 >= WINNING_SCORE) {
          setGameOver(true);
          setWinner('Jugador 2 (Rojo)');
          onGameOver(newScore.player1);
        }
        return newScore;
      });
      resetBall();
    }

    if (ballX.current > CANVAS_WIDTH) {
      setScore(prev => {
        const newScore = { ...prev, player1: prev.player1 + 1 };
        if (newScore.player1 >= WINNING_SCORE) {
          setGameOver(true);
          setWinner('Jugador 1 (Azul)');
          onGameOver(newScore.player1);
        }
        return newScore;
      });
      resetBall();
    }
  }, [score, resetBall, onGameOver]);

  useEffect(() => {
    if (!gameStarted || isPaused || gameOver) {
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current);
      }
      draw();
      return;
    }

    const animate = () => {
      update();
      draw();
      gameLoop.current = requestAnimationFrame(animate);
    };

    gameLoop.current = requestAnimationFrame(animate);

    return () => {
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current);
      }
    };
  }, [gameStarted, isPaused, gameOver, update, draw]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 's' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        keys.current.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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
      <div className="flex items-center justify-between w-full max-w-[600px] px-2">
        <div className="text-blue-400 text-xs sm:text-sm" style={{ 
          fontFamily: 'monospace',
          textShadow: '0 0 10px rgba(59, 130, 246, 0.8)'
        }}>
          J1: {score.player1}
        </div>
        {isPaused && (
          <div className="text-yellow-400 animate-pulse text-xs sm:text-sm" style={{ fontFamily: 'monospace' }}>
            PAUSADO
          </div>
        )}
        <div className="text-red-400 text-xs sm:text-sm" style={{ 
          fontFamily: 'monospace',
          textShadow: '0 0 10px rgba(239, 68, 68, 0.8)'
        }}>
          J2: {score.player2}
        </div>
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

      <div className="relative w-full flex justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 sm:border-4 border-blue-500 rounded max-w-full h-auto"
          style={{
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)',
            imageRendering: 'pixelated',
            width: '100%',
            maxWidth: '600px'
          }}
        />

        {showCountdown && <Countdown onComplete={handleCountdownComplete} />}

        {!gameStarted && !gameOver && !showCountdown && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded">
            <div className="text-center px-4">
              <p className="text-white mb-2 text-sm sm:text-base" style={{ fontFamily: 'monospace' }}>
                Presiona INICIAR para comenzar
              </p>
              <p className="text-gray-300 text-xs sm:text-sm" style={{ fontFamily: 'monospace' }}>
                Primer jugador en llegar a {WINNING_SCORE} gana
              </p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded">
            <div className="text-center px-4">
              <p className="text-yellow-400 mb-2 text-sm sm:text-base animate-pulse" style={{ 
                fontFamily: 'monospace',
                textShadow: '0 0 20px rgba(234, 179, 8, 0.8)'
              }}>
                ¡{winner} GANA!
              </p>
              <p className="text-white mb-3 sm:mb-4 text-sm sm:text-base" style={{ fontFamily: 'monospace' }}>
                <span className="text-blue-400">{score.player1}</span> - <span className="text-red-400">{score.player2}</span>
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
