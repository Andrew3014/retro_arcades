import { ArrowLeft, Trophy, Info, Gamepad, Check, AlertCircle, MessageCircle, Flag } from 'lucide-react';
import { SnakeGame } from './games/SnakeGame';
import { PongGame } from './games/PongGame';
import { TetrisGame } from './games/TetrisGame';
import { Page, User } from '../App';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { RankingNameModal } from './RankingNameModal';
import { ImageWithFallback } from './figma/ImageWithFallback';

const normalizeImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  // Si ya es una URL absoluta (http/https o data:) devolverla tal cual
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return url;
  // Si no, tratarla como relativa y agregar la URL base de la API
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  try {
    return new URL(url, base).href;
  } catch {
    return url;
  }
};

// URLs de imágenes por defecto para cada juego
const DEFAULT_GAME_IMAGES: Record<string, { creator?: string; company?: string }> = {
  tetris: {
    creator: 'https://tse4.mm.bing.net/th/id/OIP.oFbgz7-lAeXjMO5xyZz-ywHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3',
    company: 'https://tse3.mm.bing.net/th/id/OIP.YY7fQEc9P3NanrMmnxLKIAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  snake: {
    creator: 'https://tse2.mm.bing.net/th/id/OIP.gmbUapF2uUC719-Zw5q3QAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    company: 'https://dplnews.com/wp-content/uploads/2020/10/dplnews_nokia_mc281020.jpg',
  },
  pong: {
    creator: 'https://tse3.mm.bing.net/th/id/OIP.nht1oPLuSiGiEJGdYBUTdQHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3',
    company: 'https://tse3.mm.bing.net/th/id/OIP.NcbTQBbaqvR3mHVh-j0YEgHaGR?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
};

interface Toast { id: number; message: string; type: 'success' | 'error'; }

interface GamePageProps {
  game: 'snake' | 'pong' | 'tetris';
  onBack: () => void;
  user: User | null;
}

interface GameInfo {
  title: string;
  year: string;
  history: string;
  controls: string[];
  rules: string[];
}

const gameInfo: Record<string, GameInfo> = {
  snake: {
    title: 'Snake',
    year: '1976',
    history: 'Snake fue creado originalmente como un concepto en 1976 por Gremlin Industries bajo el nombre "Blockade". Ganó popularidad masiva cuando Nokia lo incluyó en sus teléfonos móviles en 1998. El jugador controla una serpiente que crece al comer objetos, y el desafío es evitar chocar con las paredes o con el propio cuerpo de la serpiente.',
    controls: [
      '⌨️ TECLADO',
      '↑ ↓ ← → - Mover la serpiente',
      'Espacio - Pausar/Reanudar',
      '',
      '📱 CELULAR',
      '👆 Botones directivos - Mover la serpiente',
      '👋 Desliza en cualquier dirección - Controles por swipe',
      'Botón Pausar - Pausar/Reanudar'
    ],
    rules: ['Come la comida para crecer y ganar puntos', 'No choques con las paredes', 'No choques con tu propio cuerpo', 'Cada comida suma 10 puntos', 'La velocidad aumenta gradualmente']
  },
  pong: {
    title: 'Pong',
    year: '1972',
    history: 'Pong fue desarrollado por Atari en 1972 y es considerado uno de los primeros videojuegos comercialmente exitosos. Fue diseñado por Allan Alcorn como un ejercicio de entrenamiento, pero su simplicidad y jugabilidad adictiva lo convirtieron en un fenómeno arcade. Pong simulaba tenis de mesa en 2D y estableció las bases de la industria de los videojuegos.',
    controls: [
      '⌨️ TECLADO',
      'W / S - Mover paleta izquierda',
      '↑ / ↓ - Mover paleta derecha',
      'Espacio - Iniciar/Pausar',
      '',
      '📱 CELULAR',
      '👆 Botones ↑↓ - Mover tu paleta',
      '👋 Desliza ↑ o ↓ - Control por swipe'
    ],
    rules: ['Impide que la pelota pase tu paleta', 'Primer jugador en llegar a 11 puntos gana', 'La pelota acelera con cada rebote', 'Cada punto aumenta la dificultad', 'El ángulo de rebote depende de dónde golpees']
  },
  tetris: {
    title: 'Tetris',
    year: '1984',
    history: 'Tetris fue creado por Alexey Pajitnov en 1984 en la Unión Soviética. Es uno de los videojuegos más vendidos de la historia. El concepto simple pero adictivo de apilar bloques para formar líneas completas ha cautivado a generaciones. El juego ha sido adaptado a prácticamente todas las plataformas de videojuegos existentes y es considerado un clásico atemporal.',
    controls: [
      '⌨️ TECLADO',
      '← → - Mover pieza',
      '↓ - Caída rápida',
      '↑ - Rotar pieza',
      'Espacio - Caída instantánea',
      '',
      '📱 CELULAR',
      '👆 Botones direccionales - Mover, rotar y caer',
      '👋 Desliza ← o → - Mover pieza',
      '👋 Desliza ↑ - Rotar pieza',
      '👋 Desliza ↓ - Acelerar caída'
    ],
    rules: ['Completa líneas horizontales para eliminarlas', 'Apila las piezas estratégicamente', 'El juego termina si las piezas llegan arriba', 'Más líneas simultáneas = más puntos', 'La velocidad aumenta con el nivel']
  }
};

export function GamePage({ game, onBack, user }: GamePageProps) {
  const info = gameInfo[game];
  const [scores, setScores] = useState<Array<{ name: string; score: number; date: string }>>([]);
  const [newRecord, setNewRecord] = useState<boolean>(false);
  const [comment, setComment] = useState('');
  const [report, setReport] = useState('');
  const [meta, setMeta] = useState<any>(null);
  const [myInfo, setMyInfo] = useState<{ best: number; rank: number | null; rankingName: string | null } | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [pendingScore, setPendingScore] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({ comment: false, report: false });
  const [userReports, setUserReports] = useState<Array<{ id: number; content: string; status: string; created_at: string }>>([]);
  const [commentsList, setCommentsList] = useState<Array<{ id: number; user_id?: number; username?: string; content: string; created_at: string }>>([]);

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };
  
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.rankings(game, 50);
        setScores(data);
        const g = await api.game(game);
        // Normalizar URLs de imágenes del creador y empresa (manejar rutas relativas de la API)
        g.creator_photo_url = normalizeImageUrl(g.creator_photo_url);
        g.company_photo_url = normalizeImageUrl(g.company_photo_url);
        // Si la API no proporcionó imágenes, usar las por defecto por slug si están disponibles
        const defaults = DEFAULT_GAME_IMAGES[game];
        if ((!g.creator_photo_url || g.creator_photo_url === '') && defaults?.creator) {
          g.creator_photo_url = normalizeImageUrl(defaults.creator);
        }
        if ((!g.company_photo_url || g.company_photo_url === '') && defaults?.company) {
          g.company_photo_url = normalizeImageUrl(defaults.company);
        }
        setMeta(g);
        // Cargar comentarios públicos del juego
        try {
          const comments = await api.getComments(game);
          setCommentsList((comments || []).map((c: any) => ({ id: c.id, username: c.author || c.username || 'Anon', content: c.content, created_at: c.date || c.created_at })));
        } catch (e) {
          console.warn('Error cargando comentarios del juego:', e);
          setCommentsList([]);
        }
        // Cargar info personal del juego - crítico para mostrar nombre de ranking
        try {
          const me = await api.meGame(game);
          if (me) {
            setMyInfo(me);
          }
        } catch (e) {
          console.warn('Error cargando info personal:', e);
          setMyInfo(null);
        }
        // Cargar reportes del usuario
        if (user) {
          try {
            const reports = await api.myReports(game);
            setUserReports(reports);
          } catch (e) {
            console.warn('Error cargando reportes del usuario:', e);
            setUserReports([]);
          }
        }
      } catch (e) {
        console.warn('Error cargando datos del juego:', e);
        setScores([]);
      }
    };
    load();
  }, [game, user]);

  const submitAndRefresh = async (finalScore: number, rankingName?: string) => {
    const res = await api.submitScore(game, finalScore, rankingName);
    setNewRecord(!!res.newRecord);
    // Recargar datos del ranking, información personal e información del juego
    try {
      const data = await api.rankings(game, 50);
      setScores(data);
      const me = await api.meGame(game);
      if (me) setMyInfo(me);
      addToast('Puntaje guardado exitosamente');
    } catch (e: any) {
      addToast(e.message || 'Error al actualizar ranking', 'error');
    }
    if (res.newRecord) setTimeout(() => setNewRecord(false), 4000);
  };

  const handleGameOver = async (score: number) => {
    // No guardar puntajes cero o negativos
    if (score <= 0) return;
    if (!user) {
      addToast('Debes iniciar sesión para guardar tu puntaje', 'error');
      return;
    }
    try {
      // Si el usuario no tiene nombre de ranking aún, abrir el modal
      if (!myInfo || myInfo.rankingName == null) {
        setPendingScore(score);
        setShowNameModal(true);
        return;
      }
      await submitAndRefresh(score);
    } catch (err: any) {
      addToast(err.message || 'No se pudo guardar el puntaje', 'error');
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      addToast('Inicia sesión para comentar', 'error');
      return;
    }
    if (!comment.trim()) {
      addToast('El comentario no puede estar vacío', 'error');
      return;
    }
    setSubmitting(prev => ({ ...prev, comment: true }));
    try {
      await api.addComment(game, comment.trim());
      setComment('');
      addToast('Comentario publicado exitosamente');
      // Recargar comentarios públicos
      try {
        const comments = await api.getComments(game);
        setCommentsList((comments || []).map((c: any) => ({ id: c.id, username: c.author || c.username || 'Anon', content: c.content, created_at: c.date || c.created_at })));
      } catch (e) {
        console.warn('Error recargando comentarios:', e);
      }
    } catch (e: any) {
      addToast(e.message || 'Error al publicar comentario', 'error');
    } finally {
      setSubmitting(prev => ({ ...prev, comment: false }));
    }
  };

  const handleReportSubmit = async () => {
    if (!user) {
      addToast('Inicia sesión para reportar', 'error');
      return;
    }
    if (!report.trim()) {
      addToast('El reporte no puede estar vacío', 'error');
      return;
    }
    setSubmitting(prev => ({ ...prev, report: true }));
    try {
      await api.report(game, report.trim());
      setReport('');
      addToast('Reporte enviado al administrador');
      // Recargar los reportes del usuario
      const reports = await api.myReports(game);
      setUserReports(reports);
    } catch (e: any) {
      addToast(e.message || 'Error al enviar reporte', 'error');
    } finally {
      setSubmitting(prev => ({ ...prev, report: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-purple-300 hover:text-purple-100 active:text-purple-50 mb-4 sm:mb-6 transition-colors duration-200 ease-out hover:scale-105 active:scale-95"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm sm:text-base">Volver a inicio</span>
      </button>

      <div className="w-full grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Game Canvas */}
        <div className="lg:col-span-2 w-full">
          <div className="bg-gradient-to-b from-black/60 to-black/40 border-2 sm:border-4 border-purple-500/70 rounded-lg p-3 sm:p-4 lg:p-6 backdrop-blur-sm w-full" style={{
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(168, 85, 247, 0.05)'
          }}>
            <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6 flex-wrap gap-2">
              <h2 className="text-white text-base sm:text-xl md:text-2xl lg:text-3xl font-bold" style={{
                textShadow: '0 0 10px rgba(168, 85, 247, 0.8)',
                fontFamily: 'monospace'
              }}>
                {info.title}
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {meta?.creator_photo_url ? (
                    <ImageWithFallback
                      src={meta.creator_photo_url}
                      alt={meta.creator_name || 'Creador'}
                      className="w-10 h-10 rounded-md object-cover border border-purple-600/40"
                      title={meta.creator_name || 'Creador'}
                    />
                  ) : null}
                  {meta?.company_photo_url ? (
                    <ImageWithFallback
                      src={meta.company_photo_url}
                      alt={meta.company_name || 'Empresa'}
                      className="w-10 h-10 rounded-md object-cover border border-purple-600/40"
                      title={meta.company_name || 'Empresa'}
                    />
                  ) : null}
                </div>
                <span className="px-2 sm:px-3 py-1 bg-purple-600/50 text-purple-200 rounded text-sm" style={{
                  fontFamily: 'monospace'
                }}>
                  EST. {info.year}
                </span>
              </div>
            </div>
            
            {game === 'snake' && <SnakeGame onGameOver={handleGameOver} />}
            {game === 'pong' && <PongGame onGameOver={handleGameOver} />}
            {game === 'tetris' && <TetrisGame onGameOver={handleGameOver} />}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* History */}
          <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h3 className="text-purple-300 text-sm sm:text-base">Historia</h3>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              {info.history}
            </p>
            {meta && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-purple-200 text-xs mb-1">Creador</div>
                  {meta.creator_photo_url ? (
                    <ImageWithFallback
                      src={meta.creator_photo_url}
                      alt={meta.creator_name || 'Creador'}
                      className="w-full h-24 object-cover rounded"
                    />
                  ) : null}
                  <div className="text-gray-300 text-xs mt-1">{meta.creator_name}</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-200 text-xs mb-1">Empresa</div>
                  {meta.company_photo_url ? (
                    <ImageWithFallback
                      src={meta.company_photo_url}
                      alt={meta.company_name || 'Empresa'}
                      className="w-full h-24 object-cover rounded"
                    />
                  ) : null}
                  <div className="text-gray-300 text-xs mt-1">{meta.company_name}</div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Gamepad className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h3 className="text-purple-300 text-sm sm:text-base">Controles</h3>
            </div>
            <ul className="space-y-1.5 sm:space-y-2">
              {info.controls.map((control, index) => (
                <li key={index} className={`flex items-start gap-2 ${
                  control === '' ? 'my-2 border-t border-purple-500/20' : ''
                } ${control.includes('TECLADO') || control.includes('CELULAR') ? 'text-purple-300 font-semibold text-xs sm:text-sm mt-2 mb-1' : 'text-gray-300 text-xs sm:text-sm'}`}>
                  {!control.includes('TECLADO') && !control.includes('CELULAR') && control !== '' && (
                    <span className="text-purple-400 mt-0.5 flex-shrink-0">▸</span>
                  )}
                  <span style={{ fontFamily: control === '' || control.includes('TECLADO') || control.includes('CELULAR') ? 'inherit' : 'monospace' }}>
                    {control}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Rules */}
          <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h3 className="text-purple-300 text-sm sm:text-base">Reglas</h3>
            </div>
            <ul className="space-y-1.5 sm:space-y-2">
              {info.rules.map((rule, index) => (
                <li key={index} className="text-gray-300 text-xs sm:text-sm flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ranking */}
          <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <h3 className="text-purple-300 text-sm sm:text-base">Ranking Global</h3>
            </div>
            {scores.length > 0 ? (
              <div className="space-y-1.5 sm:space-y-2">
                {scores.slice(0, 5).map((score, index) => (
                  <div key={index} className="flex items-center justify-between text-xs sm:text-sm bg-purple-900/20 rounded p-1.5 sm:p-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <span className={`flex-shrink-0 ${
                        index === 0 ? 'text-yellow-400' : 
                        index === 1 ? 'text-gray-300' : 
                        index === 2 ? 'text-orange-400' : 
                        'text-purple-400'
                      }`} style={{ fontFamily: 'monospace' }}>
                        #{index + 1}
                      </span>
                      <span className="text-white truncate">{score.name}</span>
                    </div>
                    <span className="text-purple-300 flex-shrink-0 ml-2" style={{ fontFamily: 'monospace' }}>
                      {score.score}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-xs sm:text-sm text-center py-4">
                ¡Sé el primero en establecer un récord!
              </p>
            )}
            {newRecord && (
              <div className="mt-3 text-center text-green-300" style={{ fontFamily: 'monospace' }}>
                ¡Nuevo récord personal! 🎉
              </div>
            )}
            {myInfo && (
              <div className="mt-3 text-center text-purple-200 text-xs">
                Tu récord: <span className="text-white">{myInfo.best || 0}</span> {myInfo.rank ? `• Posición: #${myInfo.rank}` : ''}
              </div>
            )}
            {/* Comment box */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3 h-3 text-blue-400" />
                <label className="text-purple-300 text-xs font-semibold">Comentario público</label>
              </div>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe un comentario..."
                maxLength={500}
                disabled={submitting.comment}
                className="w-full bg-black/50 border border-purple-500/40 rounded px-3 py-2 text-white text-sm disabled:opacity-50"
              />
              <button
                className="w-full bg-blue-700 hover:bg-blue-600 active:bg-blue-700 active:scale-95 disabled:opacity-50 text-white rounded py-2 text-sm transition-all duration-200 ease-out"
                onClick={handleCommentSubmit}
                disabled={submitting.comment || !comment.trim()}
              >
                {submitting.comment ? 'Publicando...' : 'Publicar comentario'}
              </button>
            </div>
            {/* Report box */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <Flag className="w-3 h-3 text-pink-400" />
                <label className="text-purple-300 text-xs font-semibold">Reporte privado</label>
              </div>
              <input
                value={report}
                onChange={(e) => setReport(e.target.value)}
                placeholder="Reportar un error al admin..."
                maxLength={500}
                disabled={submitting.report}
                className="w-full bg-black/50 border border-purple-500/40 rounded px-3 py-2 text-white text-sm disabled:opacity-50"
              />
              <button
                className="w-full bg-pink-700 hover:bg-pink-600 active:bg-pink-700 active:scale-95 disabled:opacity-50 text-white rounded py-2 text-sm transition-all duration-200 ease-out"
                onClick={handleReportSubmit}
                disabled={submitting.report || !report.trim()}
              >
                {submitting.report ? 'Enviando...' : 'Enviar reporte'}
              </button>
              {/* Mis reportes */}
              {userReports.length > 0 && (
                <div className="mt-4 pt-3 border-t border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Flag className="w-3 h-3 text-pink-300" />
                    <label className="text-purple-300 text-xs font-semibold">Mis reportes</label>
                  </div>
                  <div className="space-y-2">
                    {userReports.map((r) => (
                      <div key={r.id} className="bg-black/30 border border-pink-500/20 rounded p-2 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-300 line-clamp-2">{r.content}</span>
                          <span className={`text-xs px-2 py-0.5 rounded font-semibold flex-shrink-0 ml-2 ${
                            r.status === 'open' ? 'bg-yellow-900/50 text-yellow-200' :
                            r.status === 'reviewed' ? 'bg-blue-900/50 text-blue-200' :
                            'bg-green-900/50 text-green-200'
                          }`}>
                            {r.status === 'open' ? 'ABIERTO' : r.status === 'reviewed' ? 'REVISADO' : 'ARREGLADO'}
                          </span>
                        </div>
                        <div className="text-gray-500 text-xs">{new Date(r.created_at).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Comentarios públicos */}
            <div className="mt-4 pt-3 border-t border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-3 h-3 text-blue-300" />
                <label className="text-purple-300 text-xs font-semibold">Comentarios</label>
              </div>
              {commentsList.length === 0 ? (
                <p className="text-gray-400 text-xs">Aún no hay comentarios. Sé el primero en escribir uno.</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {commentsList.map((c) => (
                    <div key={c.id} className="bg-black/25 border border-purple-500/20 rounded p-2 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-white truncate" style={{ fontFamily: 'monospace' }}>{c.username || 'Anon'}</span>
                        </div>
                        <div className="text-gray-400 text-xxs ml-2">{new Date(c.created_at).toLocaleString()}</div>
                      </div>
                      <div className="text-white text-sm line-clamp-3">{c.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {user && (
        <RankingNameModal
          open={showNameModal}
          defaultName={user.username || 'Jugador'}
          onConfirm={async (name: string) => {
            setShowNameModal(false);
            const s = pendingScore;
            setPendingScore(null);
            if (s != null) {
              try { await submitAndRefresh(s, name); } catch (e: any) { addToast(e.message || 'No se pudo guardar el puntaje', 'error'); }
            }
          }}
          onCancel={async () => {
            setShowNameModal(false);
            const s = pendingScore;
            setPendingScore(null);
            if (s != null) {
              // Si el usuario cancela, guardar usando el nombre de usuario por defecto
              try { await submitAndRefresh(s); } catch (e: any) { addToast(e.message || 'No se pudo guardar el puntaje', 'error'); }
            }
          }}
        />
      )}
    </div>
  );
}

