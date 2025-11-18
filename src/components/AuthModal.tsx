import { useState } from 'react';
import { X, User, Mail, Lock, Gamepad2 } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { api } from '../lib/api';

interface AuthModalProps {
  onClose: () => void;
  onAuth: (user: { username: string; email: string; role?: 'user' | 'admin' }) => void;
}

export function AuthModal({ onClose, onAuth }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (submitting) return;
    // Validaciones básicas
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }

    if (!formData.email || !formData.password || (!isLogin && !formData.username)) {
      setErrorMsg('Por favor completa todos los campos');
      return;
    }

    try {
      setSubmitting(true);
      if (isLogin) {
        const { token, user } = await api.login({ email: formData.email, password: formData.password });
        localStorage.setItem('token', token);
        onAuth({ username: user.username, email: user.email, role: user.role });
      } else {
        const { token, user } = await api.register({ email: formData.email, username: formData.username, password: formData.password });
        localStorage.setItem('token', token);
        onAuth({ username: user.username, email: user.email, role: user.role });
      }
      onClose();
    } catch (err: any) {
      const msg = String(err?.message || 'Error de autenticación');
      setErrorMsg(msg.includes('Credenciales inválidas') ? 'Correo o contraseña incorrectos.' : msg);
    }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-purple-900 border-4 border-purple-500 rounded-lg shadow-2xl overflow-hidden"
        style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)' }}>
        
        {/* Header */}
        <div className="relative bg-black/50 p-6 border-b-2 border-purple-500/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white active:text-purple-300 transition-colors duration-200 ease-out"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="w-8 h-8 text-purple-400" />
            <h2 className="text-white" style={{
              textShadow: '0 0 10px rgba(168, 85, 247, 0.8)',
              fontFamily: 'monospace'
            }}>
              {isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
            </h2>
          </div>
          <p className="text-purple-200 text-sm">
            {isLogin ? 'Continúa tu partida' : 'Únete a la comunidad retro'}
          </p>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="mx-6 mt-4 rounded border-2 border-pink-600/60 bg-gradient-to-r from-pink-900/60 to-red-900/50 text-pink-100 px-4 py-2 flex items-start gap-2" role="alert">
            <span>⚠️</span>
            <div className="flex-1">
              <div className="font-semibold" style={{ fontFamily: 'monospace' }}>No pudimos autenticarte</div>
              <div className="text-sm">{errorMsg}</div>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-pink-200 hover:text-white active:text-pink-400 transition-colors duration-200 ease-out">✕</button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-purple-200 flex items-center gap-2">
                <User className="w-4 h-4" />
                Nombre de usuario
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-black/50 border-purple-500/50 text-white focus:border-purple-400"
                placeholder="Jugador123"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-purple-200 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-black/50 border-purple-500/50 text-white focus:border-purple-400"
              placeholder="jugador@retro.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-purple-200 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-black/50 border-purple-500/50 text-white focus:border-purple-400"
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-purple-200 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirmar contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="bg-black/50 border-purple-500/50 text-white focus:border-purple-400"
                placeholder="••••••••"
                required={!isLogin}
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:from-purple-700 active:to-pink-700 active:scale-95 text-white border-0 disabled:opacity-60 transition-all duration-200 ease-out"
            style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
          >
            {submitting ? 'Procesando...' : isLogin ? 'ENTRAR' : 'CREAR CUENTA'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-300 hover:text-purple-100 active:text-purple-50 text-sm transition-colors duration-200 ease-out"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-black/30 p-4 border-t-2 border-purple-500/50">
          <p className="text-gray-400 text-xs text-center">
            Conecta con tu base de datos para guardar tu progreso y competir en rankings globales
          </p>
        </div>
      </div>
    </div>
  );
}
