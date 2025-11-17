import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, Play, Pause } from 'lucide-react';

interface MobileControlsProps {
  game: 'snake' | 'pong' | 'tetris';
  onControl: (key: string) => void;
  isPaused: boolean;
}

export function MobileControls({ game, onControl, isPaused }: MobileControlsProps) {
  const handleButton = (key: string) => {
    onControl(key);
  };

  if (game === 'snake') {
    return (
      <div className="md:hidden mt-6 bg-black/50 border-2 border-purple-500/50 rounded-lg p-4">
        <p className="text-purple-200 text-sm text-center mb-4">Controles táctiles</p>
        <div className="flex flex-col items-center gap-2">
          <button
            onTouchStart={() => handleButton('ArrowUp')}
            className="p-4 bg-purple-600/50 hover:bg-purple-600 rounded-lg border-2 border-purple-400"
          >
            <ArrowUp className="w-6 h-6 text-white" />
          </button>
          <div className="flex gap-2">
            <button
              onTouchStart={() => handleButton('ArrowLeft')}
              className="p-4 bg-purple-600/50 hover:bg-purple-600 rounded-lg border-2 border-purple-400"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onTouchStart={() => handleButton('ArrowDown')}
              className="p-4 bg-purple-600/50 hover:bg-purple-600 rounded-lg border-2 border-purple-400"
            >
              <ArrowDown className="w-6 h-6 text-white" />
            </button>
            <button
              onTouchStart={() => handleButton('ArrowRight')}
              className="p-4 bg-purple-600/50 hover:bg-purple-600 rounded-lg border-2 border-purple-400"
            >
              <ArrowRight className="w-6 h-6 text-white" />
            </button>
          </div>
          <button
            onTouchStart={() => handleButton(' ')}
            className="mt-2 px-6 py-3 bg-yellow-600/50 hover:bg-yellow-600 rounded-lg border-2 border-yellow-400 flex items-center gap-2"
          >
            {isPaused ? <Play className="w-5 h-5 text-white" /> : <Pause className="w-5 h-5 text-white" />}
            <span className="text-white text-sm">{isPaused ? 'Reanudar' : 'Pausar'}</span>
          </button>
        </div>
      </div>
    );
  }

  if (game === 'tetris') {
    return (
      <div className="md:hidden mt-6 bg-black/50 border-2 border-purple-500/50 rounded-lg p-4">
        <p className="text-purple-200 text-sm text-center mb-4">Controles táctiles</p>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 justify-center">
            <button
              onTouchStart={() => handleButton('ArrowLeft')}
              className="p-4 bg-purple-600/50 hover:bg-purple-600 rounded-lg border-2 border-purple-400"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onTouchStart={() => handleButton('ArrowDown')}
              className="p-4 bg-purple-600/50 hover:bg-purple-600 rounded-lg border-2 border-purple-400"
            >
              <ArrowDown className="w-6 h-6 text-white" />
            </button>
            <button
              onTouchStart={() => handleButton('ArrowRight')}
              className="p-4 bg-purple-600/50 hover:bg-purple-600 rounded-lg border-2 border-purple-400"
            >
              <ArrowRight className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onTouchStart={() => handleButton('ArrowUp')}
              className="flex-1 px-4 py-3 bg-blue-600/50 hover:bg-blue-600 rounded-lg border-2 border-blue-400 flex items-center justify-center gap-2"
            >
              <RotateCw className="w-5 h-5 text-white" />
              <span className="text-white text-sm">Rotar</span>
            </button>
            <button
              onTouchStart={() => handleButton(' ')}
              className="flex-1 px-4 py-3 bg-yellow-600/50 hover:bg-yellow-600 rounded-lg border-2 border-yellow-400 flex items-center justify-center gap-2"
            >
              <ArrowDown className="w-5 h-5 text-white" />
              <span className="text-white text-sm">Caer</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
