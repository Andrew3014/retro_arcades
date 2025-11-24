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

  // Botón reutilizable para mantener consistencia
  const DirectionButton = ({ direction, icon: Icon }: { direction: string; icon: any }) => (
    <button
      onTouchStart={() => handleButton(direction)}
      onMouseDown={() => handleButton(direction)}
      className="active:scale-95 transition-all duration-75 p-3 sm:p-4 lg:p-5 bg-gradient-to-b from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 active:from-purple-700 active:to-purple-800 rounded-lg border-2 border-purple-400 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center min-h-12 sm:min-h-14 min-w-12 sm:min-w-14"
    >
      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
    </button>
  );

  if (game === 'snake') {
    return (
      <div className="md:hidden mt-4 sm:mt-6 bg-gradient-to-b from-black/60 to-black/80 border-2 border-purple-500/70 rounded-lg p-4 sm:p-6 backdrop-blur-sm shadow-lg shadow-purple-500/20">
        <p className="text-purple-300 text-xs sm:text-sm text-center mb-4 font-semibold tracking-wide">CONTROLES TÁCTILES</p>
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          {/* Fila arriba */}
          <DirectionButton direction="ArrowUp" icon={ArrowUp} />
          
          {/* Fila izquierda-centro-derecha */}
          <div className="flex gap-3 sm:gap-4 justify-center">
            <DirectionButton direction="ArrowLeft" icon={ArrowLeft} />
            <DirectionButton direction="ArrowDown" icon={ArrowDown} />
            <DirectionButton direction="ArrowRight" icon={ArrowRight} />
          </div>
          
          {/* Botón pausar/reanudar */}
          <button
            onTouchStart={() => handleButton(' ')}
            onMouseDown={() => handleButton(' ')}
            className="mt-2 w-full active:scale-95 transition-all duration-75 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 active:from-yellow-700 active:to-yellow-800 rounded-lg border-2 border-yellow-400 shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center gap-2 sm:gap-3 min-h-14 sm:min-h-16"
          >
            {isPaused ? <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
            <span className="text-white text-sm sm:text-base font-semibold">{isPaused ? 'Reanudar' : 'Pausar'}</span>
          </button>
        </div>
      </div>
    );
  }

  if (game === 'tetris') {
    return (
      <div className="md:hidden mt-4 sm:mt-6 bg-gradient-to-b from-black/60 to-black/80 border-2 border-purple-500/70 rounded-lg p-4 sm:p-6 backdrop-blur-sm shadow-lg shadow-purple-500/20">
        <p className="text-purple-300 text-xs sm:text-sm text-center mb-4 font-semibold tracking-wide">CONTROLES TÁCTILES</p>
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Fila mover: izq-centro-der */}
          <div className="flex gap-3 sm:gap-4 justify-center">
            <DirectionButton direction="ArrowLeft" icon={ArrowLeft} />
            <DirectionButton direction="ArrowDown" icon={ArrowDown} />
            <DirectionButton direction="ArrowRight" icon={ArrowRight} />
          </div>
          
          {/* Fila rotar y caer */}
          <div className="flex gap-3 sm:gap-4">
            <button
              onTouchStart={() => handleButton('ArrowUp')}
              onMouseDown={() => handleButton('ArrowUp')}
              className="flex-1 active:scale-95 transition-all duration-75 px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:from-blue-700 active:to-blue-800 rounded-lg border-2 border-blue-400 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2 min-h-14 sm:min-h-16"
            >
              <RotateCw className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="text-white text-xs sm:text-sm font-semibold">Rotar</span>
            </button>
            <button
              onTouchStart={() => handleButton(' ')}
              onMouseDown={() => handleButton(' ')}
              className="flex-1 active:scale-95 transition-all duration-75 px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-b from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 active:from-yellow-700 active:to-yellow-800 rounded-lg border-2 border-yellow-400 shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center gap-2 min-h-14 sm:min-h-16"
            >
              <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="text-white text-xs sm:text-sm font-semibold">Caer</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (game === 'pong') {
    return (
      <div className="md:hidden mt-4 sm:mt-6 bg-gradient-to-b from-black/60 to-black/80 border-2 border-purple-500/70 rounded-lg p-4 sm:p-6 backdrop-blur-sm shadow-lg shadow-purple-500/20">
        <p className="text-purple-300 text-xs sm:text-sm text-center mb-4 font-semibold tracking-wide">CONTROLES TÁCTILES</p>
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Paleta izquierda */}
          <div>
            <p className="text-purple-200 text-xs mb-2">Paleta Izquierda (W/S)</p>
            <div className="flex gap-3 sm:gap-4">
              <button
                onTouchStart={() => handleButton('w')}
                onMouseDown={() => handleButton('w')}
                className="flex-1 active:scale-95 transition-all duration-75 px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:from-indigo-700 active:to-indigo-800 rounded-lg border-2 border-indigo-400 shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center min-h-12 sm:min-h-14"
              >
                <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </button>
              <button
                onTouchStart={() => handleButton('s')}
                onMouseDown={() => handleButton('s')}
                className="flex-1 active:scale-95 transition-all duration-75 px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:from-indigo-700 active:to-indigo-800 rounded-lg border-2 border-indigo-400 shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center min-h-12 sm:min-h-14"
              >
                <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </button>
            </div>
          </div>
          
          {/* Paleta derecha */}
          <div>
            <p className="text-purple-200 text-xs mb-2">Paleta Derecha (↑/↓)</p>
            <div className="flex gap-3 sm:gap-4">
              <button
                onTouchStart={() => handleButton('ArrowUp')}
                onMouseDown={() => handleButton('ArrowUp')}
                className="flex-1 active:scale-95 transition-all duration-75 px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-b from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 active:from-cyan-700 active:to-cyan-800 rounded-lg border-2 border-cyan-400 shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center min-h-12 sm:min-h-14"
              >
                <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </button>
              <button
                onTouchStart={() => handleButton('ArrowDown')}
                onMouseDown={() => handleButton('ArrowDown')}
                className="flex-1 active:scale-95 transition-all duration-75 px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-b from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 active:from-cyan-700 active:to-cyan-800 rounded-lg border-2 border-cyan-400 shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center min-h-12 sm:min-h-14"
              >
                <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </button>
            </div>
          </div>

          {/* Botón iniciar/pausar */}
          <button
            onTouchStart={() => handleButton(' ')}
            onMouseDown={() => handleButton(' ')}
            className="mt-2 w-full active:scale-95 transition-all duration-75 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 active:from-yellow-700 active:to-yellow-800 rounded-lg border-2 border-yellow-400 shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center gap-2 sm:gap-3 min-h-14 sm:min-h-16"
          >
            {isPaused ? <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
            <span className="text-white text-sm sm:text-base font-semibold">{isPaused ? 'Iniciar' : 'Pausar'}</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
