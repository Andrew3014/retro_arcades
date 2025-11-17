import { Gamepad2, Home, Trophy, LogIn, LogOut, User, Settings } from 'lucide-react';
import { Page, User as UserType } from '../App';
import { Button } from './ui/button';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: UserType | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function Navbar({ currentPage, onNavigate, user, onLogin, onLogout }: NavbarProps) {
  return (
    <nav className="bg-black/50 backdrop-blur-sm border-b-4 border-purple-500 sticky top-0 z-50" style={{
      boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 sm:gap-3 hover:scale-105 transition-transform"
          >
            <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            <span className="text-white tracking-wider text-sm sm:text-base" style={{
              textShadow: '0 0 10px rgba(168, 85, 247, 0.8)',
              fontFamily: 'monospace'
            }}>
              <span className="hidden sm:inline">RETRO ARCADE</span>
              <span className="sm:hidden">ARCADE</span>
            </span>
          </button>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded transition-all ${
                currentPage === 'home' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-purple-600/30'
              }`}
              style={{
                boxShadow: currentPage === 'home' ? '0 0 15px rgba(168, 85, 247, 0.6)' : 'none'
              }}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Inicio</span>
            </button>

            <button
              onClick={() => onNavigate('rankings')}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded transition-all ${
                currentPage === 'rankings' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-purple-600/30'
              }`}
              style={{
                boxShadow: currentPage === 'rankings' ? '0 0 15px rgba(168, 85, 247, 0.6)' : 'none'
              }}
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Rankings</span>
            </button>

            {user && (
              <button
                onClick={() => onNavigate('profile')}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded transition-all ${
                  currentPage === 'profile' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-purple-600/30'
                }`}
                style={{
                  boxShadow: currentPage === 'profile' ? '0 0 15px rgba(168, 85, 247, 0.6)' : 'none'
                }}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Perfil</span>
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded transition-all ${
                  currentPage === 'admin' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-purple-600/30'
                }`}
                style={{
                  boxShadow: currentPage === 'admin' ? '0 0 15px rgba(168, 85, 247, 0.6)' : 'none'
                }}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-purple-900/50 rounded border border-purple-500/50">
                  <User className="w-4 h-4 text-purple-300" />
                  <span className="text-purple-200 text-sm" style={{ fontFamily: 'monospace' }}>
                    {user.username}
                  </span>
                </div>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/50 text-purple-200 hover:bg-purple-600/30 hover:text-white"
                >
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={onLogin}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 px-3 sm:px-4"
                style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)' }}
              >
                <LogIn className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Entrar</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
