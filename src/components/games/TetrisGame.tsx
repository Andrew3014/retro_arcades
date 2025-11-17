import { useEffect, useRef, useState, useCallback } from 'react';
import { GameControls } from '../GameControls';
import { Countdown } from '../Countdown';

interface TetrisGameProps {
  onGameOver: (score: number) => void;
}

type Piece = number[][];
type Board = number[][];

const PIECES: Piece[] = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
];

const COLORS = [
  '#000', 
  '#00f0f0', // Cian
  '#f0f000', // Amarillo
  '#a000f0', // Morado
  '#00f000', // Verde
  '#f00000', // Rojo
  '#0000f0', // Azul
  '#f0a000'  // Naranja
];

const GLOW_COLORS = [
  'rgba(0,0,0,0)',
  'rgba(0, 240, 240, 0.5)',
  'rgba(240, 240, 0, 0.5)',
  'rgba(160, 0, 240, 0.5)',
  'rgba(0, 240, 0, 0.5)',
  'rgba(240, 0, 0, 0.5)',
  'rgba(0, 0, 240, 0.5)',
  'rgba(240, 160, 0, 0.5)'
];

export function TetrisGame({ onGameOver }: TetrisGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const COLS = 10;
  const ROWS = 20;
  const CELL_SIZE = 20;
  const CANVAS_WIDTH = COLS * CELL_SIZE;
  const CANVAS_HEIGHT = ROWS * CELL_SIZE;

  const board = useRef<Board>(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const currentPiece = useRef<Piece>(PIECES[0]);
  const currentPieceType = useRef(0);
  const pieceX = useRef(0);
  const pieceY = useRef(0);
  const gameLoop = useRef<number>();
  const lastMoveDown = useRef(0);

  const createNewPiece = useCallback(() => {
    const type = Math.floor(Math.random() * PIECES.length);
    currentPiece.current = PIECES[type];
    currentPieceType.current = type + 1;
    pieceX.current = Math.floor(COLS / 2) - Math.floor(currentPiece.current[0].length / 2);
    pieceY.current = 0;

    if (checkCollision(currentPiece.current, pieceX.current, pieceY.current)) {
      setGameOver(true);
      return false;
    }
    return true;
  }, []);

  const checkCollision = (piece: Piece, x: number, y: number): boolean => {
    for (let row = 0; row < piece.length; row++) {
      for (let col = 0; col < piece[row].length; col++) {
        if (piece[row][col]) {
          const newX = x + col;
          const newY = y + row;
          if (newX < 0 || newX >= COLS || newY >= ROWS) {
            return true;
          }
          if (newY >= 0 && board.current[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotatePiece = (piece: Piece): Piece => {
    const rotated = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
    return rotated;
  };

  const mergePiece = useCallback(() => {
    for (let row = 0; row < currentPiece.current.length; row++) {
      for (let col = 0; col < currentPiece.current[row].length; col++) {
        if (currentPiece.current[row][col]) {
          const y = pieceY.current + row;
          const x = pieceX.current + col;
          if (y >= 0) {
            board.current[y][x] = currentPieceType.current;
          }
        }
      }
    }

    // Check for complete lines
    let linesCleared = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board.current[row].every(cell => cell !== 0)) {
        board.current.splice(row, 1);
        board.current.unshift(Array(COLS).fill(0));
        linesCleared++;
        row++;
      }
    }

    if (linesCleared > 0) {
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      setLevel(Math.floor(lines / 10) + 1);
    }
  }, [level, lines]);

  const resetGame = useCallback(() => {
    board.current = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(false);
    createNewPiece();
  }, [createNewPiece]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar el canvas con un gradiente oscuro
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#1a0a2e');
    gradient.addColorStop(1, '#0a0a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Dibujar el tablero con efectos mejorados
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (board.current[row][col]) {
          const color = COLORS[board.current[row][col]];
          const glowColor = GLOW_COLORS[board.current[row][col]];
          
          ctx.shadowBlur = 10;
          ctx.shadowColor = glowColor;
          ctx.fillStyle = color;
          ctx.fillRect(col * CELL_SIZE + 1, row * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
          
          // Efecto de resaltado
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(col * CELL_SIZE + 2, row * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE / 2 - 2);
        }
      }
    }

    // Dibujar la pieza actual con efectos
    const color = COLORS[currentPieceType.current];
    const glowColor = GLOW_COLORS[currentPieceType.current];
    ctx.fillStyle = color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = glowColor;
    
    for (let row = 0; row < currentPiece.current.length; row++) {
      for (let col = 0; col < currentPiece.current[row].length; col++) {
        if (currentPiece.current[row][col]) {
          const x = (pieceX.current + col) * CELL_SIZE;
          const y = (pieceY.current + row) * CELL_SIZE;
          ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
          
          // Resaltado
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE / 2 - 2);
          ctx.fillStyle = color;
        }
      }
    }
    ctx.shadowBlur = 0;

    // Dibujar la cuadrícula con brillo sutil
    ctx.strokeStyle = 'rgba(160, 0, 240, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_WIDTH, i * CELL_SIZE);
      ctx.stroke();
    }
  }, []);

  const moveDown = useCallback(() => {
    if (!checkCollision(currentPiece.current, pieceX.current, pieceY.current + 1)) {
      pieceY.current++;
    } else {
      mergePiece();
      if (!createNewPiece()) {
        return false;
      }
    }
    return true;
  }, [mergePiece, createNewPiece]);

  useEffect(() => {
    if (!gameStarted || isPaused || gameOver) {
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current);
      }
      draw();
      return;
    }

    const animate = (currentTime: number) => {
      gameLoop.current = requestAnimationFrame(animate);

      const dropSpeed = Math.max(100, 1000 - level * 100);
      
      if (currentTime - lastMoveDown.current > dropSpeed) {
        if (!moveDown()) {
          if (gameLoop.current) {
            cancelAnimationFrame(gameLoop.current);
          }
          return;
        }
        lastMoveDown.current = currentTime;
      }

      draw();
    };

    gameLoop.current = requestAnimationFrame(animate);

    return () => {
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current);
      }
    };
  }, [gameStarted, isPaused, gameOver, level, moveDown, draw]);

  useEffect(() => {
    if (gameOver) {
      onGameOver(score);
    }
  }, [gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || isPaused || gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (!checkCollision(currentPiece.current, pieceX.current - 1, pieceY.current)) {
            pieceX.current--;
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (!checkCollision(currentPiece.current, pieceX.current + 1, pieceY.current)) {
            pieceX.current++;
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          const rotated = rotatePiece(currentPiece.current);
          if (!checkCollision(rotated, pieceX.current, pieceY.current)) {
            currentPiece.current = rotated;
          }
          break;
        case ' ':
          e.preventDefault();
          while (!checkCollision(currentPiece.current, pieceX.current, pieceY.current + 1)) {
            pieceY.current++;
          }
          mergePiece();
          createNewPiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, isPaused, gameOver, moveDown, mergePiece, createNewPiece]);

  const handleStart = () => {
    if (gameOver) {
      resetGame();
    }
    if (!gameStarted) {
      createNewPiece();
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
      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-[200px]">
        <div className="text-center">
          <div className="text-purple-300 text-xs sm:text-sm">PUNTOS</div>
          <div className="text-white text-sm sm:text-base" style={{ 
            fontFamily: 'monospace',
            textShadow: '0 0 10px rgba(168, 85, 247, 0.8)'
          }}>{score}</div>
        </div>
        <div className="text-center">
          <div className="text-purple-300 text-xs sm:text-sm">NIVEL</div>
          <div className="text-white text-sm sm:text-base" style={{ 
            fontFamily: 'monospace',
            textShadow: '0 0 10px rgba(168, 85, 247, 0.8)'
          }}>{level}</div>
        </div>
        <div className="text-center">
          <div className="text-purple-300 text-xs sm:text-sm">LÍNEAS</div>
          <div className="text-white text-sm sm:text-base" style={{ 
            fontFamily: 'monospace',
            textShadow: '0 0 10px rgba(168, 85, 247, 0.8)'
          }}>{lines}</div>
        </div>
      </div>

      {isPaused && (
        <div className="text-yellow-400 animate-pulse text-sm sm:text-base" style={{ fontFamily: 'monospace' }}>
          PAUSADO
        </div>
      )}

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
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 sm:border-4 border-purple-500 rounded max-w-full h-auto"
          style={{
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)',
            imageRendering: 'pixelated',
            width: '100%',
            maxWidth: '200px'
          }}
        />

        {showCountdown && <Countdown onComplete={handleCountdownComplete} />}

        {!gameStarted && !gameOver && !showCountdown && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded">
            <div className="text-center px-4">
              <p className="text-white mb-2 text-xs sm:text-sm" style={{ fontFamily: 'monospace' }}>
                Presiona INICIAR para comenzar
              </p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded">
            <div className="text-center px-4">
              <p className="text-red-400 mb-2 text-sm sm:text-base animate-pulse" style={{ 
                fontFamily: 'monospace',
                textShadow: '0 0 20px rgba(239, 68, 68, 0.8)'
              }}>
                ¡GAME OVER!
              </p>
              <p className="text-white mb-1 sm:mb-2 text-xs sm:text-sm" style={{ fontFamily: 'monospace' }}>
                Puntuación: <span className="text-purple-400">{score}</span>
              </p>
              <p className="text-white mb-3 sm:mb-4 text-xs sm:text-sm" style={{ fontFamily: 'monospace' }}>
                Líneas: <span className="text-purple-400">{lines}</span>
              </p>
              <p className="text-gray-300 text-xs" style={{ fontFamily: 'monospace' }}>
                Presiona INICIAR para jugar de nuevo
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
