import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { api } from '../lib/api';

interface AdminPageProps { onBack: () => void; }

export function AdminPage({ onBack }: AdminPageProps) {
  const [overview, setOverview] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filterGame, setFilterGame] = useState<string>('');
  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [edits, setEdits] = useState<Record<number, { score?: number; rankingName?: string; dirty?: boolean; saving?: boolean }>>({});

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
    } catch (e) {}
  };

  useEffect(() => { load(); }, []);

  function authHeader() { return {}; }

  const deleteComment = async (id: number) => { await api.adminDeleteComment(id); load(); };

  const setReportStatus = async (id: number, status: string) => { await api.adminUpdateReport(id, status); load(); };

  const updateScore = async (id: number, score: number) => { await api.adminUpdateScore(id, score); load(); };

  const deleteScore = async (id: number) => { await api.adminDeleteScore(id); load(); };

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
      if (ops.length > 0) await Promise.all(ops);
      await load();
      setEdits(prev => ({ ...prev, [s.id]: {} }));
    } finally {
      setEdits(prev => ({ ...prev, [s.id]: { ...prev[s.id], saving: false, dirty: false } }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-purple-300 hover:text-purple-100 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Volver a inicio
      </button>

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
            {comments.map((c) => (
              <div key={c.id} className="border border-purple-500/30 rounded p-3 flex items-start justify-between">
                <div>
                  <div className="text-white text-sm">{c.username} • {c.game}</div>
                  <div className="text-gray-300 text-sm">{c.content}</div>
                </div>
                <Button variant="outline" className="border-purple-500/50 text-purple-200" onClick={() => deleteComment(c.id)}>Eliminar</Button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-4">
          <h2 className="text-purple-200 mb-3">Reportes</h2>
          <div className="space-y-3 max-h-[400px] overflow-auto">
            {reports.map((r) => (
              <div key={r.id} className="border border-purple-500/30 rounded p-3">
                <div className="text-white text-sm">{r.username} • {r.game}</div>
                <div className="text-gray-300 text-sm mb-2">{r.content}</div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setReportStatus(r.id, 'reviewed')}>Marcar revisado</Button>
                  <Button size="sm" onClick={() => setReportStatus(r.id, 'closed')}>Cerrar</Button>
                </div>
              </div>
            ))}
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
            .map((s) => (
            <div key={s.id} className="border border-purple-500/30 rounded p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-white text-sm truncate">{(s.ranking_name || s.username)} • {s.game}</div>
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
                <Button variant="outline" className="border-purple-500/50 text-purple-200" onClick={() => deleteScore(s.id)}>Eliminar</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-4 mt-6">
        <h2 className="text-purple-200 mb-3">Usuarios</h2>
        <div className="space-y-2 max-h-[420px] overflow-auto text-sm">
          {users.map(u => (
            <div key={u.id} className="border border-purple-500/30 rounded p-3 flex flex-col gap-1">
              <div className="text-white font-semibold">{u.username} ({u.role})</div>
              <div className="text-gray-300 break-all">{u.email}</div>
              <div className="text-gray-400 text-xs">Creado: {new Date(u.created_at).toLocaleString()}</div>
            </div>
          ))}
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
