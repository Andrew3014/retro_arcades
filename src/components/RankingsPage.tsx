import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Filter, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { api } from '../lib/api';

interface RankingsPageProps {
  onBack: () => void;
}

interface ScoreEntry {
  rank: number;
  name: string;
  score: number;
  date: string;
  level?: number;
  lines?: number;
}

export function RankingsPage({ onBack }: RankingsPageProps) {
  const [selectedGame, setSelectedGame] = useState<'snake' | 'pong' | 'tetris'>('snake');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [rankings, setRankings] = useState<Record<string, ScoreEntry[]>>({
    snake: [],
    pong: [],
    tetris: []
  });

  useEffect(() => {
    const load = async () => {
      const games = ['snake', 'pong', 'tetris'] as const;
      const newRankings: Record<string, ScoreEntry[]> = { snake: [], pong: [], tetris: [] };
      for (const g of games) {
        try {
          const data = await api.rankings(g, 100);
          newRankings[g] = data.map((d: any, i: number) => ({ rank: i + 1, ...d }));
        } catch (_e) {
          newRankings[g] = [];
        }
      }
      setRankings(newRankings);
    };
    load();
  }, []);

  const gameInfo = {
    snake: { name: 'Snake', color: 'from-green-500 to-emerald-600', icon: '🐍' },
    pong: { name: 'Pong', color: 'from-blue-500 to-cyan-600', icon: '🏓' },
    tetris: { name: 'Tetris', color: 'from-purple-500 to-pink-600', icon: '🧩' }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-purple-400" style={{ fontFamily: 'monospace' }}>#{rank}</div>;
    }
  };

  const currentRankings = rankings[selectedGame] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-purple-300 hover:text-purple-100 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a inicio
      </button>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-10 h-10 text-yellow-400" />
          <h1 className="text-white" style={{
            textShadow: '0 0 20px rgba(168, 85, 247, 0.8)',
            fontFamily: 'monospace',
            letterSpacing: '0.1em'
          }}>
            RANKINGS GLOBALES
          </h1>
        </div>
        <p className="text-purple-200">
          Compite con los mejores jugadores y alcanza la cima
        </p>
      </div>

      {/* Game Selector Tabs */}
      <div className="mb-8">
        <Tabs value={selectedGame} onValueChange={(value) => setSelectedGame(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/50 border-2 border-purple-500/50 p-1">
            <TabsTrigger 
              value="snake" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white text-purple-200"
            >
              <span className="mr-2">🐍</span>
              <span className="hidden sm:inline">Snake</span>
            </TabsTrigger>
            <TabsTrigger 
              value="pong"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-purple-200"
            >
              <span className="mr-2">🏓</span>
              <span className="hidden sm:inline">Pong</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tetris"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white text-purple-200"
            >
              <span className="mr-2">🧩</span>
              <span className="hidden sm:inline">Tetris</span>
            </TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex items-center justify-between mt-6 mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-400" />
              <span className="text-purple-200 text-sm">Filtrar por período:</span>
            </div>
            <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
              <SelectTrigger className="w-[180px] bg-black/50 border-purple-500/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-purple-500/50">
                <SelectItem value="all" className="text-white">Todos los tiempos</SelectItem>
                <SelectItem value="today" className="text-white">Hoy</SelectItem>
                <SelectItem value="week" className="text-white">Esta semana</SelectItem>
                <SelectItem value="month" className="text-white">Este mes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rankings Content */}
          <TabsContent value="snake" className="mt-0">
            <RankingsList rankings={currentRankings} game="snake" gameInfo={gameInfo.snake} getRankIcon={getRankIcon} />
          </TabsContent>
          <TabsContent value="pong" className="mt-0">
            <RankingsList rankings={currentRankings} game="pong" gameInfo={gameInfo.pong} getRankIcon={getRankIcon} />
          </TabsContent>
          <TabsContent value="tetris" className="mt-0">
            <RankingsList rankings={currentRankings} game="tetris" gameInfo={gameInfo.tetris} getRankIcon={getRankIcon} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface RankingsListProps {
  rankings: ScoreEntry[];
  game: string;
  gameInfo: { name: string; color: string; icon: string };
  getRankIcon: (rank: number) => JSX.Element;
}

function RankingsList({ rankings, game, gameInfo, getRankIcon }: RankingsListProps) {
  if (rankings.length === 0) {
    return (
      <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-12 text-center">
        <div className="text-6xl mb-4">{gameInfo.icon}</div>
        <p className="text-purple-200 mb-2">No hay rankings todavía</p>
        <p className="text-gray-400 text-sm">¡Sé el primero en establecer un récord en {gameInfo.name}!</p>
      </div>
    );
  }

  return (
    <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 border-b-2 border-purple-500/50">
        <div className="grid grid-cols-12 gap-4 text-purple-200 text-sm">
          <div className="col-span-2 sm:col-span-1">Pos</div>
          <div className="col-span-5 sm:col-span-4">Jugador</div>
          <div className="col-span-3 sm:col-span-2">Puntos</div>
          {game === 'tetris' && (
            <>
              <div className="hidden sm:block sm:col-span-2">Nivel</div>
              <div className="hidden sm:block sm:col-span-2">Líneas</div>
            </>
          )}
          <div className="col-span-2 sm:col-span-1">Fecha</div>
        </div>
      </div>

      {/* Rankings List */}
      <div className="divide-y divide-purple-500/20">
        {rankings.map((entry, index) => (
          <div
            key={index}
            className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-purple-900/20 transition-colors ${
              entry.rank <= 3 ? 'bg-purple-900/10' : ''
            }`}
          >
            <div className="col-span-2 sm:col-span-1 flex justify-center">
              {getRankIcon(entry.rank)}
            </div>
            <div className="col-span-5 sm:col-span-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gameInfo.color}`} />
                <span className="text-white truncate">{entry.name}</span>
              </div>
            </div>
            <div className="col-span-3 sm:col-span-2">
              <span className="text-purple-300" style={{ fontFamily: 'monospace' }}>
                {entry.score.toLocaleString()}
              </span>
            </div>
            {game === 'tetris' && (
              <>
                <div className="hidden sm:block sm:col-span-2 text-gray-400" style={{ fontFamily: 'monospace' }}>
                  Nv. {entry.level || 1}
                </div>
                <div className="hidden sm:block sm:col-span-2 text-gray-400" style={{ fontFamily: 'monospace' }}>
                  {entry.lines || 0}
                </div>
              </>
            )}
            <div className="col-span-2 sm:col-span-1 text-gray-400 text-xs">
              {new Date(entry.date).toLocaleDateString('es', { day: '2-digit', month: '2-digit' })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {rankings.length >= 10 && (
        <div className="bg-purple-900/20 p-4 border-t-2 border-purple-500/50 text-center">
          <p className="text-gray-400 text-sm">
            Mostrando top {rankings.length} jugadores
          </p>
        </div>
      )}
    </div>
  );
}
