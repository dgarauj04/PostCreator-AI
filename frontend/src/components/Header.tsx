import React from 'react';
import { Smartphone, Laptop, Wand2, History, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type View = 'home' | 'history';

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          {user && (
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                title="Sair da conta"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-8 h-8 md:w-10 md:h-10 text-brand-red-light" />
              <Laptop className="w-8 h-8 md:w-10 md:h-10 text-brand-red-light" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">
                PostCreator AI
              </h1>
            </div>
          </div>

          <div className="invisible">
            {user && (
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-slate-700 text-white px-3 py-2 rounded-lg text-sm">
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center">
              <div className="hidden sm:block text-right">
                <p className="text-slate-300 text-sm italic font-semibold max-w-[120px]">{user.username}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center mt-8">
          <p className="text-center text-slate-400 mb-2">Seu Criador de Conteúdo de Mídia Social com IA</p>
          
          <nav className="flex justify-center gap-4 mt-2 border-b border-slate-700 pb-4 w-full">
            <button
              onClick={() => setView('home')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                currentView === 'home'
                  ? 'bg-brand-red-light text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Wand2 size={16} />
              Gerador
            </button>
            <button
              onClick={() => setView('history')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                currentView === 'history'
                  ? 'bg-brand-red-light text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <History size={16} />
              Histórico
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};