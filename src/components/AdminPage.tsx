import { useEffect, useState } from 'react';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { api } from '../lib/api';

interface AdminPageProps { onBack: () => void; }
interface Toast { id: number; message: string; type: 'success' | 'error'; }

export function AdminPage({ onBack }: AdminPageProps) {
  const [overview, setOverview] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filterGame, setFilterGame] = useState<string>('');
  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [edits, setEdits] = useState<Record<number, { score?: number; rankingName?: string; dirty?: boolean; saving?: boolean }>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const load = async () => {
    try {
      const [ov, cm, rp, sc, us] = await Promise.all([
        api.adminOverview(),
        api.adminComments(),
        api.adminReports(),
        api.adminScores(),
        api.adminUsers(),
      ]);
      setOverview(ov);
      setComments(cm);
      setReports(rp);
      setScores(sc);
      setUsers(us);
    } catch (e) {
      addToast('Error cargando datos', 'error');
    }
  };

  useEffect(() => { load(); }, []);

  const deleteComment = async (id: number) => {
    if (!window.confirm('¿Eliminar este comentario?')) return;
    setLoading(prev => ({ ...prev, [id]: true }));
    try {
      await api.adminDeleteComment(id);
      addToast('Comentario eliminado');
      await load();
    } catch (e: any) {
      addToast(e.message || 'Error al eliminar', 'error');
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const setReportStatus = async (id: number, status: string) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    try {
      await api.adminUpdateReport(id, status);
      const statusLabel = status === 'reviewed' ? 'revisado' : 'cerrado';
      addToast(`Reporte marcado como ${statusLabel}`);
      await load();
    } catch (e: any) {
      addToast(e.message || 'Error al actualizar', 'error');
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const deleteScore = async (id: number) => {
    if (!window.confirm('¿Eliminar este puntaje?')) return;
    setLoading(prev => ({ ...prev, [id]: true }));
    try {
      await api.adminDeleteScore(id);
      addToast('Puntaje eliminado');
      await load();
    } catch (e: any) {
      addToast(e.message || 'Error al eliminar', 'error');
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const saveRow = async (s: any) => {
    const e = edits[s.id] || {};
    if (!e.dirty || e.saving) return;
    setEdits(prev => ({ ...prev, [s.id]: { ...e, saving: true } }));
    try {
      const ops: Promise<any>[] = [];
      const nextScore = (e.score ?? s.score);
      const nextName = (e.rankingName ?? s.ranking_name ?? '');
      if (nextScore !== s.score && Number.isInteger(nextScore as any) && (nextScore as any) >= 0) {
        ops.push(api.adminUpdateScore(s.id, Number(nextScore)));
      }
      const trimmed = String(nextName).trim();
      if ((trimmed || '') !== (s.ranking_name || '') && trimmed.length >= 3 && trimmed.length <= 30) {
        ops.push(api.adminUpdateRankingName(s.user_id, s.game, trimmed));
      }
      if (ops.length > 0) {
        await Promise.all(ops);
        addToast('Puntaje guardado exitosamente');
        await load();
        setEdits(prev => ({ ...prev, [s.id]: {} }));
      }
    } catch (e: any) {
      addToast(e.message || 'Error al guardar', 'error');
    } finally {
      setEdits(prev => ({ ...prev, [s.id]: { ...prev[s.id], saving: false, dirty: false } }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-purple-300 hover:text-purple-100 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Volver a inicio
      </button>

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded border ${
            t.type === 'success' 
              ? 'bg-green-900/80 border-green-500/60 text-green-100'
              : 'bg-red-900/80 border-red-500/60 text-red-100'
          }`}>
            {t.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {t.message}
          </div>
        ))}
      </div>

      <h1 className="text-white mb-4" style={{ fontFamily: 'monospace' }}>Panel Admin</h1>
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Stat label="Usuarios" value={overview.users} />
          <Stat label="Puntajes" value={overview.scores} />
          <Stat label="Comentarios" value={overview.comments} />
          <Stat label="Reportes abiertos" value={overview.openReports} />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-4">
          <h2 className="text-purple-200 mb-3">Comentarios</h2>
          <div className="space-y-3 max-h-[400px] overflow-auto">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-sm">Sin comentarios</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="border border-purple-500/30 rounded p-3 flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-white text-sm font-semibold truncate">{c.username} • {c.game}</div>
                    <div className="text-gray-300 text-sm break-words">{c.content}</div>
                    <div className="text-gray-500 text-xs mt-1">{new Date(c.created_at).toLocaleString()}</div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-red-500/50 text-red-200 hover:bg-red-900/20 flex-shrink-0"
                    disabled={loading[c.id]}
                    onClick={() => deleteComment(c.id)}
                  >
                    {loading[c.id] ? 'Eliminando...' : 'Eliminar'}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-4">
          <h2 className="text-purple-200 mb-3">Reportes</h2>
          <div className="space-y-3 max-h-[400px] overflow-auto">
            {reports.length === 0 ? (
              <p className="text-gray-400 text-sm">Sin reportes</p>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="border border-purple-500/30 rounded p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-white text-sm font-semibold">{r.username} • {r.game}</div>
                      <div className="text-gray-400 text-xs mt-1">{new Date(r.created_at).toLocaleString()}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-semibold flex-shrink-0 ${
                      r.status === 'open' ? 'bg-yellow-900/50 text-yellow-200' :
                      r.status === 'reviewed' ? 'bg-blue-900/50 text-blue-200' :
                      'bg-green-900/50 text-green-200'
                    }`}>
                      {r.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-gray-300 text-sm mb-3 break-words">{r.content}</div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      disabled={loading[r.id] || r.status === 'reviewed'}
                      className="bg-blue-700 hover:bg-blue-600 disabled:opacity-50"
                      onClick={() => setReportStatus(r.id, 'reviewed')}
                    >
                      {loading[r.id] ? 'Procesando...' : 'Marcar revisado'}
                    </Button>
                    <Button 
                      size="sm" 
                      disabled={loading[r.id] || r.status === 'closed'}
                      className="bg-green-700 hover:bg-green-600 disabled:opacity-50"
                      onClick={() => setReportStatus(r.id, 'closed')}
                    >
                      {loading[r.id] ? 'Procesando...' : 'Cerrar'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-4 mt-6">
        <h2 className="text-purple-200 mb-3">Puntajes (CRUD)</h2>
        <div className="flex flex-wrap gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <label>Filtrar juego:</label>
            <select className="bg-black/50 border border-purple-500/40 rounded px-2 py-1" value={filterGame} onChange={e=>setFilterGame(e.target.value)}>
              <option value="">Todos</option>
              {[...new Set(scores.map(s=>s.game))].map(g=> <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showDeleted} onChange={()=>setShowDeleted(!showDeleted)} /> Mostrar eliminados
          </label>
        </div>
        <div className="space-y-3 max-h-[420px] overflow-auto">
          {scores
            .filter(s=> !filterGame || s.game===filterGame)
            .filter(s=> showDeleted || s.is_deleted===0)
            .length === 0 ? (
            <p className="text-gray-400 text-sm">Sin puntajes</p>
          ) : (
            scores
              .filter(s=> !filterGame || s.game===filterGame)
              .filter(s=> showDeleted || s.is_deleted===0)
              .map((s) => (
              <div key={s.id} className="border border-purple-500/30 rounded p-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-white text-sm font-semibold truncate">{(s.ranking_name || s.username)} • {s.game}</div>
                  <div className="text-gray-400 text-xs">{new Date(s.date).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <input
                    type="number"
                    value={ (edits[s.id]?.score ?? s.score) }
                    min={0}
                    className="w-24 bg-black/50 border border-purple-500/40 rounded px-2 py-1 text-white"
                    onChange={(e) => {
                      const val = parseInt(e.target.value || '0', 10);
                      setEdits(prev => ({ ...prev, [s.id]: { ...prev[s.id], score: val, dirty: true } }));
                    }}
                  />
                  <input
                    type="text"
                    value={ (edits[s.id]?.rankingName ?? (s.ranking_name || '')) }
                    placeholder="Ranking name"
                    className="w-32 bg-black/50 border border-purple-500/40 rounded px-2 py-1 text-white"
                    onChange={(e) => {
                      const val = e.target.value;
                      setEdits(prev => ({ ...prev, [s.id]: { ...prev[s.id], rankingName: val, dirty: true } }));
                    }}
                  />
                  <Button size="sm" className="bg-purple-700 hover:bg-purple-600 text-white" disabled={!edits[s.id]?.dirty || edits[s.id]?.saving} onClick={() => saveRow(s)}>
                    {edits[s.id]?.saving ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-red-500/50 text-red-200 hover:bg-red-900/20"
                    disabled={loading[s.id]}
                    onClick={() => deleteScore(s.id)}
                  >
                    {loading[s.id] ? 'Eliminando...' : 'Eliminar'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-4 mt-6">
        <h2 className="text-purple-200 mb-3">Usuarios</h2>
        <div className="space-y-2 max-h-[420px] overflow-auto text-sm">
          {users.length === 0 ? (
            <p className="text-gray-400">Sin usuarios</p>
          ) : (
            users.map(u => (
              <div key={u.id} className="border border-purple-500/30 rounded p-3 flex flex-col gap-1">
                <div className="text-white font-semibold">{u.username} <span className={`text-xs px-2 py-0.5 rounded ${u.role === 'admin' ? 'bg-red-900/50 text-red-200' : 'bg-blue-900/50 text-blue-200'}`}>{u.role.toUpperCase()}</span></div>
                <div className="text-gray-300 break-all">{u.email}</div>
                <div className="text-gray-400 text-xs">Creado: {new Date(u.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-purple-900/30 border border-purple-500/40 rounded p-4">
      <div className="text-purple-200 text-sm">{label}</div>
      <div className="text-white text-xl" style={{ fontFamily: 'monospace' }}>{value}</div>
    </div>
  );
}
