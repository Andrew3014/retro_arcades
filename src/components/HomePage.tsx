import { GameCard } from './GameCard';
import { Page } from '../App';

interface HomePageProps {
  onGameSelect: (page: Page) => void;
}

export function HomePage({ onGameSelect }: HomePageProps) {
  const games = [
    {
      id: 'snake' as const,
      title: 'Snake',
      year: '1976',
      description: 'El clásico juego de la serpiente que debe comer y crecer sin chocarse.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'pong' as const,
      title: 'Pong',
      year: '1972',
      description: 'El primer videojuego arcade comercialmente exitoso.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'tetris' as const,
      title: 'Tetris',
      year: '1984',
      description: 'El legendario juego de bloques que debes encajar perfectamente.',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-white mb-4 text-2xl sm:text-3xl md:text-4xl" style={{
          textShadow: '0 0 20px rgba(168, 85, 247, 0.8)',
          fontFamily: 'monospace',
          letterSpacing: '0.1em'
        }}>
          JUEGOS RETRO ARCADE
        </h1>
        <p className="text-purple-200 max-w-2xl mx-auto text-sm sm:text-base px-4">
          Revive la era dorada de los videojuegos. Juega clásicos legendarios, 
          aprende su historia y compite en los rankings globales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {games.map((game) => (
          <GameCard
            key={game.id}
            {...game}
            onClick={() => onGameSelect(game.id as Page)}
          />
        ))}
      </div>

      <div className="mt-12 sm:mt-16 bg-black/30 border-2 border-purple-500/50 rounded-lg p-6 sm:p-8 backdrop-blur-sm">
        <h2 className="text-white mb-6 sm:mb-4 text-center text-xl sm:text-2xl" style={{
          textShadow: '0 0 10px rgba(168, 85, 247, 0.6)',
          fontFamily: 'monospace'
        }}>
          ¿CÓMO FUNCIONA?
        </h2>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-6 text-center">
          <div className="p-4">
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-purple-300 mb-2">Elige tu juego</h3>
            <p className="text-gray-400 text-sm">Selecciona uno de los clásicos disponibles</p>
          </div>
          <div className="p-4">
            <div className="text-4xl mb-3">🕹️</div>
            <h3 className="text-purple-300 mb-2">Juega y compite</h3>
            <p className="text-gray-400 text-sm">Aprende los controles y consigue el mejor puntaje</p>
          </div>
          <div className="p-4">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-purple-300 mb-2">Sube al ranking</h3>
            <p className="text-gray-400 text-sm">Compara tu puntuación con otros jugadores</p>
          </div>
        </div>
      </div>
    </div>
  );
}
