import { Gamepad2, Github, Mail, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-black/50 backdrop-blur-sm border-t-4 border-purple-500 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <Gamepad2 className="w-6 h-6 text-purple-400" />
              <span className="text-white tracking-wider" style={{
                textShadow: '0 0 10px rgba(168, 85, 247, 0.8)',
                fontFamily: 'monospace'
              }}>
                RETRO ARCADE
              </span>
            </div>
            <p className="text-purple-200 text-sm">
              Revive los clásicos que marcaron la historia de los videojuegos
            </p>
          </div>

          {/* Links Section */}
          <div className="text-center">
            <h3 className="text-purple-300 mb-3" style={{ fontFamily: 'monospace' }}>
              JUEGOS DISPONIBLES
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                🐍 Snake (1976)
              </li>
              <li className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                🏓 Pong (1972)
              </li>
              <li className="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">
                🧩 Tetris (1984)
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-right">
            <h3 className="text-purple-300 mb-3" style={{ fontFamily: 'monospace' }}>
              CONECTA
            </h3>
            <div className="flex gap-4 justify-center md:justify-end">
              <button className="p-2 bg-purple-600/30 hover:bg-purple-600 rounded-lg transition-colors border border-purple-500/50">
                <Github className="w-5 h-5 text-purple-200" />
              </button>
              <button className="p-2 bg-purple-600/30 hover:bg-purple-600 rounded-lg transition-colors border border-purple-500/50">
                <Mail className="w-5 h-5 text-purple-200" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-500/30 pt-6 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2 flex-wrap">
            <span>© {currentYear} Retro Arcade</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Hecho con <Heart className="w-4 h-4 text-red-500 fill-red-500" /> para los gamers
            </span>
          </p>
          <p className="text-purple-300/50 text-xs mt-2" style={{ fontFamily: 'monospace' }}>
            PRESS START TO CONTINUE...
          </p>
        </div>
      </div>
    </footer>
  );
}
