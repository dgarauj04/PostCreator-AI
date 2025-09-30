import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Background from '../components/Background';

export const Login: React.FC = () => {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const clickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!loginIdentifier || !password) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    try {
      await login(loginIdentifier, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Background />
      <div className="w-full max-w-md mx-auto p-8 bg-slate-800/80 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-sm animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">
            PostCreator AI
          </h1>
          <p className="text-slate-400 mt-2">Bem-vindo de volta!</p>
        </div>
        <form onSubmit={clickSubmit} className="space-y-6">
          <div>
            <label htmlFor="login_identifier" className="block text-sm font-medium text-slate-300 mb-2">Email ou nome de usuário</label>
            <input
              type="text"
              id="login_identifier"
              required
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-600 rounded-lg p-3 transition-all duration-200 text-slate-300"
              placeholder="seu@email.com ou username"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Senha</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-600 rounded-lg p-3 transition-all duration-200 text-slate-300"
              placeholder="********"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button 
            type="submit" 
            onSubmit={clickSubmit}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-red text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-gradient-to-r from-red-800 to-red-700 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Entrar
              </>
            )}
          </button>
        </form>
        <p className="text-center text-md text-slate-400 mt-6">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-semibold text-brand-red-light hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};