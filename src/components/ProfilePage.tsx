import { useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { api } from '../lib/api';

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const [rankingNames, setRankingNames] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Array<{ slug: string; score: number; date: string }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [snake, pong, tetris] = await Promise.all([
          api.game('snake').catch(() => null),
          api.game('pong').catch(() => null),
          api.game('tetris').catch(() => null),
        ]);
        const [meSnake, mePong, meTetris] = await Promise.all([
          api.rankings('snake').catch(() => []),
          api.rankings('pong').catch(() => []),
          api.rankings('tetris').catch(() => []),
        ]);
        // Not used directly; we fetch rankingName through /me/scores?game, but we can get history now
        const h = await api.myScores();
        setHistory(h);
      } catch {}
    };
    load();
  }, []);

  const saveName = async (slug: string) => {
    const name = rankingNames[slug];
    if (!name || name.length < 3) { alert('Nombre mínimo 3 caracteres'); return; }
    try {
      await api.updateRankingName(slug, name);
      alert('Nombre actualizado');
    } catch (e: any) {
      alert(e.message || 'Error al actualizar nombre');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-purple-300 hover:text-purple-100 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a inicio
      </button>

      <h1 className="text-white mb-4" style={{ fontFamily: 'monospace' }}>Perfil</h1>
      <p className="text-purple-200 mb-6">Edita tu nombre a mostrar en los rankings por juego.</p>

      {['snake','pong','tetris'].map((slug) => (
        <div key={slug} className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <Input
              placeholder={`Nombre en ${slug}`}
              value={rankingNames[slug] || ''}
              onChange={(e) => setRankingNames({ ...rankingNames, [slug]: e.target.value })}
              className="bg-black/50 border-purple-500/50 text-white"
            />
            <Button onClick={() => saveName(slug)} className="bg-purple-600 text-white">
              <Save className="w-4 h-4 mr-2" /> Guardar
            </Button>
          </div>
        </div>
      ))}

      <div className="mt-8">
        <h2 className="text-purple-200 mb-3">Historial de partidas</h2>
        <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-3 border-b border-purple-500/30 text-purple-200">
            <div className="col-span-4">Juego</div>
            <div className="col-span-4">Puntaje</div>
            <div className="col-span-4">Fecha</div>
          </div>
          {history.length === 0 && (
            <div className="p-4 text-gray-400">Sin partidas aún.</div>
          )}
          {history.map((h, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-4 p-3 border-b border-purple-500/10">
              <div className="col-span-4 text-white">{h.slug}</div>
              <div className="col-span-4 text-purple-300">{h.score}</div>
              <div className="col-span-4 text-gray-400">{new Date(h.date).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
