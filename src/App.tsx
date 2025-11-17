import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { GamePage } from './components/GamePage';
import { RankingsPage } from './components/RankingsPage';
import { AuthModal } from './components/AuthModal';
import { PixelBackground } from './components/PixelBackground';
import { Footer } from './components/Footer';
import { ProfilePage } from './components/ProfilePage';
import { AdminPage } from './components/AdminPage';

export type Page = 'home' | 'snake' | 'pong' | 'tetris' | 'rankings' | 'profile' | 'admin';

export interface User {
  username: string;
  email: string;
  role?: 'user' | 'admin';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuth = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex flex-col">
      <PixelBackground />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          user={user}
          onLogin={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />
        
        <main className="flex-1">
          {currentPage === 'home' && <HomePage onGameSelect={setCurrentPage} />}
          {currentPage === 'snake' && <GamePage game="snake" onBack={() => setCurrentPage('home')} user={user} />}
          {currentPage === 'pong' && <GamePage game="pong" onBack={() => setCurrentPage('home')} user={user} />}
          {currentPage === 'tetris' && <GamePage game="tetris" onBack={() => setCurrentPage('home')} user={user} />}
          {currentPage === 'rankings' && <RankingsPage onBack={() => setCurrentPage('home')} />}
          {currentPage === 'profile' && <ProfilePage onBack={() => setCurrentPage('home')} />}
          {currentPage === 'admin' && user?.role === 'admin' && <AdminPage onBack={() => setCurrentPage('home')} />}
        </main>

        <Footer />

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} onAuth={handleAuth} />
        )}
      </div>
    </div>
  );
}
