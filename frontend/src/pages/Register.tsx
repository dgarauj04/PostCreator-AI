import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Background from '../components/Background';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const clickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !userName || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    setIsLoading(true);
    try {
      await register(email, password, userName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
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
          <p className="text-slate-400 mt-2">Crie sua conta para começar</p>
        </div>
        <form onSubmit={clickSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-600 rounded-lg p-3 transition-all duration-200 text-slate-300"
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-slate-300 mb-2">Nome de Usuário</label>
            <input
              type="text"
              id="userName"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-600 rounded-lg p-3 transition-all duration-200 text-slate-300"
              placeholder="Usuari01234"
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
              placeholder="Crie uma senha forte (mín. 6 caracteres)"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">Confirme a Senha</label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-600 rounded-lg p-3 transition-all duration-200 text-slate-300"
              placeholder="Repita sua senha"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-red text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-gradient-to-r from-red-800 to-red-700 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Criar Conta
              </>
            )}
          </button>
        </form>
        <p className="text-center text-md text-slate-400 mt-6">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-semibold text-brand-red-light hover:underline">
            Faça Login
          </Link>
        </p>
      </div>
    </div>
  );
};