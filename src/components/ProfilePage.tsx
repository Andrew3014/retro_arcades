import { useEffect, useState } from 'react';
import { ArrowLeft, Save, Check, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { api } from '../lib/api';

interface ProfilePageProps {
  onBack: () => void;
}

interface Toast { id: number; message: string; type: 'success' | 'error'; }

export function ProfilePage({ onBack }: ProfilePageProps) {
  const [rankingNames, setRankingNames] = useState<Record<string, string>>({});
  const [currentNames, setCurrentNames] = useState<Record<string, string | null>>({ snake: null, pong: null, tetris: null });
  const [history, setHistory] = useState<Array<{ slug: string; score: number; date: string }>>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  useEffect(() => {
    const load = async () => {
      try {
        // Cargar historial de puntajes
        const h = await api.myScores();
        setHistory(h);

        // Cargar nombres actuales de rankings por juego
        const games = ['snake', 'pong', 'tetris'];
        const names: Record<string, string | null> = {};
        for (const game of games) {
          try {
            const meGame = await api.meGame(game);
            names[game] = meGame?.ranking_name || null;
          } catch {
            names[game] = null;
          }
        }
        setCurrentNames(names);
      } catch (e: any) {
        addToast(e.message || 'Error cargando perfil', 'error');
      }
    };
    load();
  }, []);

  const saveName = async (slug: string) => {
    const newName = rankingNames[slug]?.trim();
    if (!newName || newName.length < 3 || newName.length > 30) {
      addToast('Nombre debe tener 3-30 caracteres', 'error');
      return;
    }

    setSaving(prev => ({ ...prev, [slug]: true }));
    try {
      await api.updateRankingName(slug, newName);
      setCurrentNames(prev => ({ ...prev, [slug]: newName }));
      setRankingNames(prev => ({ ...prev, [slug]: '' }));
      addToast(`Nombre en ${slug} actualizado a "${newName}"`);
    } catch (e: any) {
      addToast(e.message || 'Error al guardar nombre', 'error');
    } finally {
      setSaving(prev => ({ ...prev, [slug]: false }));
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

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded border ${
            t.type === 'success' 
              ? 'bg-green-900/80 border-green-500/60 text-green-100'
              : 'bg-red-900/80 border-red-500/60 text-red-100'
          }`}>
            {t.type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <h1 className="text-white mb-2" style={{ fontFamily: 'monospace' }}>Perfil</h1>
      <p className="text-purple-200 mb-6">Edita tu nombre a mostrar en los rankings por juego.</p>

      {['snake','pong','tetris'].map((slug) => (
        <div key={slug} className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-4 mb-4">
          <div className="mb-3">
            <div className="text-purple-300 text-sm font-semibold mb-1 uppercase">{slug}</div>
            {currentNames[slug] ? (
              <div className="text-green-400 text-sm flex items-center gap-2">
                <Check className="w-4 h-4" />
                Nombre actual: <span className="font-bold">{currentNames[slug]}</span>
              </div>
            ) : (
              <div className="text-yellow-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Sin nombre asignado aún
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder={`Nuevo nombre para ${slug}`}
              value={rankingNames[slug] || ''}
              onChange={(e) => setRankingNames({ ...rankingNames, [slug]: e.target.value })}
              className="bg-black/50 border-purple-500/50 text-white"
              maxLength={30}
            />
            <Button 
              onClick={() => saveName(slug)} 
              className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap"
              disabled={saving[slug] || !rankingNames[slug]?.trim()}
            >
              <Save className="w-4 h-4 mr-2" /> 
              {saving[slug] ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      ))}

      <div className="mt-8">
        <h2 className="text-purple-200 mb-3 text-lg font-semibold">Historial de partidas</h2>
        <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-3 border-b border-purple-500/30 text-purple-200 font-semibold text-sm">
            <div className="col-span-4">Juego</div>
            <div className="col-span-4">Puntaje</div>
            <div className="col-span-4">Fecha</div>
          </div>
          {history.length === 0 && (
            <div className="p-4 text-gray-400 text-center">Sin partidas aún.</div>
          )}
          {history.map((h, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-4 p-3 border-b border-purple-500/10 hover:bg-purple-900/20 transition-colors">
              <div className="col-span-4 text-white font-semibold">{h.slug.toUpperCase()}</div>
              <div className="col-span-4 text-green-400">{h.score}</div>
              <div className="col-span-4 text-gray-400 text-sm">{new Date(h.date).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
