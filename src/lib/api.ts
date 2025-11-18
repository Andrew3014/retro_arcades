const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function http(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...authHeader(),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  register: (data: { email: string; username: string; password: string }) =>
    http('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    http('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => http('/me'),
  myScores: (game?: string) => http(`/me/scores${game ? `?game=${game}` : ''}`),
  updateRankingName: (game: string, rankingName: string) =>
    http('/me/ranking-name', { method: 'PUT', body: JSON.stringify({ game, rankingName }) }),
  games: () => http('/games'),
  game: (slug: string) => http(`/games/${slug}`),
  rankings: (slug: string, limit = 50) => http(`/games/${slug}/rankings?limit=${limit}`),
  submitScore: (slug: string, score: number, rankingName?: string) =>
    http(`/games/${slug}/scores`, { method: 'POST', body: JSON.stringify({ score, rankingName }) }),
  meGame: (slug: string) => http(`/games/${slug}/me`),
  getComments: (slug: string) => http(`/games/${slug}/comments`),
  addComment: (slug: string, content: string) => http(`/games/${slug}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),
  report: (slug: string, content: string) => http(`/games/${slug}/reports`, { method: 'POST', body: JSON.stringify({ content }) }),
  myReports: (slug: string) => http(`/games/${slug}/my-reports`),
  // Admin
  adminOverview: () => http('/admin/overview'),
  adminComments: () => http('/admin/comments'),
  adminDeleteComment: (id: number) => http(`/admin/comments/${id}`, { method: 'DELETE' }),
  adminReports: () => http('/admin/reports'),
  adminUpdateReport: (id: number, status: string) => http(`/admin/reports/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  adminDeleteReport: (id: number) => http(`/admin/reports/${id}`, { method: 'DELETE' }),
  adminScores: () => http('/admin/scores'),
  adminUpdateScore: (id: number, score: number) => http(`/admin/scores/${id}`, { method: 'PUT', body: JSON.stringify({ score }) }),
  adminDeleteScore: (id: number) => http(`/admin/scores/${id}`, { method: 'DELETE' }),
  adminUsers: () => http('/admin/users'),
  adminUpdateRankingName: (userId: number, game: string, rankingName: string) =>
    http('/admin/ranking-name', { method: 'PUT', body: JSON.stringify({ userId, game, rankingName }) }),
};
