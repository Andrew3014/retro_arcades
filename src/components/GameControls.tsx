import { Play, Pause, RotateCcw, Maximize, Minimize } from 'lucide-react';
import { Button } from './ui/button';

interface GameControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  isFullscreen: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onFullscreen: () => void;
}

export function GameControls({ 
  isPlaying, 
  isPaused, 
  isFullscreen,
  onStart, 
  onPause, 
  onReset,
  onFullscreen 
}: GameControlsProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
      {!isPlaying ? (
        <Button
          onClick={onStart}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border-0 flex items-center gap-2"
          style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}
        >
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">Iniciar</span>
        </Button>
      ) : (
        <Button
          onClick={onPause}
          className={`${
            isPaused 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500' 
              : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500'
          } text-white border-0 flex items-center gap-2`}
          style={{ boxShadow: `0 0 15px rgba(${isPaused ? '16, 185, 129' : '234, 179, 8'}, 0.5)` }}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          <span className="hidden sm:inline">{isPaused ? 'Reanudar' : 'Pausar'}</span>
        </Button>
      )}

      <Button
        onClick={onReset}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 flex items-center gap-2"
        style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)' }}
      >
        <RotateCcw className="w-4 h-4" />
        <span className="hidden sm:inline">Reiniciar</span>
      </Button>

      <Button
        onClick={onFullscreen}
        variant="outline"
        className="border-purple-500/50 text-purple-200 hover:bg-purple-600/30 hover:text-white flex items-center gap-2"
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        <span className="hidden sm:inline">{isFullscreen ? 'Salir' : 'Pantalla'}</span>
      </Button>
    </div>
  );
}
