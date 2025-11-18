import { Play } from 'lucide-react';
import { GamePreview } from './GamePreview';

interface GameCardProps {
  id: 'snake' | 'pong' | 'tetris';
  title: string;
  year: string;
  description: string;
  color: string;
  onClick: () => void;
}

export function GameCard({ id, title, year, description, color, onClick }: GameCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-black/50 border-2 sm:border-4 border-purple-500/50 rounded-lg overflow-hidden hover:border-purple-400 active:scale-95 transition-all hover:scale-105 active:hover:scale-95 w-full duration-200 ease-out"
      style={{
        boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
        imageRendering: 'pixelated'
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
      
      {/* Game Preview Image */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-slate-900 to-purple-900/30 border-b-2 border-purple-500/30 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <GamePreview game={id} />
        </div>
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm border border-purple-500/50 rounded text-xs text-purple-200" style={{
          fontFamily: 'monospace'
        }}>
          EST. {year}
        </div>
      </div>

      {/* Card Content */}
      <div className="relative p-4 sm:p-6">
        <div className="mb-3">
          <h3 className="text-white text-lg sm:text-xl mb-2" style={{
            textShadow: '0 0 10px rgba(168, 85, 247, 0.8)',
            fontFamily: 'monospace',
            letterSpacing: '0.05em'
          }}>
            {title}
          </h3>
          <p className="text-gray-300 text-sm sm:text-base min-h-[40px]">
            {description}
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded group-hover:from-purple-500 group-hover:to-pink-500 active:from-purple-700 active:to-pink-700 transition-all" style={{
          boxShadow: '0 0 15px rgba(168, 85, 247, 0.6)'
        }}>
          <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <span className="text-white text-sm sm:text-base">JUGAR AHORA</span>
        </div>
      </div>
    </button>
  );
}
