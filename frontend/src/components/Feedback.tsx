import React, { useState, useEffect, useCallback } from 'react';
import { X, Send, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface FeedbackProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmissionStatus = 'idle' | 'sending' | 'success' | 'error';

export const Feedback: React.FC<FeedbackProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const clickClose = useCallback(() => {
    if (status === 'sending') return;
    onClose();
  }, [status, onClose]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clickClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [clickClose]);

  useEffect(() => {
    if (publicKey) {
      emailjs.init(publicKey);
    }
  }, [publicKey]);
  
  const clickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setFeedbackMessage('');

    if (!serviceID || !templateID || !publicKey) {
      setStatus('error');
      setFeedbackMessage('Erro de configuração. O administrador não configurou o serviço de email.');
      console.error("EmailJS environment variables are not set.");
      return;
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      from_assunto: 'Feedback do PostCreator AI',
      message: message,
      date: new Date().toLocaleDateString('pt-BR'),
      year: new Date().getFullYear(),
    };
    
    try {
      await emailjs.send(serviceID, templateID, templateParams);
      
      setStatus('success');
      setFeedbackMessage('Obrigado pelo seu feedback!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setFeedbackMessage('Falha ao enviar. Tente novamente mais tarde.');
      console.error('EmailJS Error:', err);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={clickClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-xl w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={clickClose} 
          className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">Envie seu Feedback</h2>
        <p className="text-sm text-slate-400 mb-6">Gostarei muito de ouvir suas sugestões e feedback sobre o PostCreator AI!</p>
        
        {status === 'success' || status === 'error' ? (
          <div className="text-center py-8">
            {status === 'success' ? (
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            ) : (
              <AlertTriangle className="w-16 h-16 mx-auto text-brand-red-light mb-4" />
            )}
            <p className={`text-lg font-semibold ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {feedbackMessage}
            </p>
            <button
              onClick={clickClose}
              className="mt-6 px-4 py-2 text-sm font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={clickSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-900/80 border border-slate-600 rounded-lg p-2.5 text-sm text-slate-300" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-900/80 border border-slate-600 rounded-lg p-2.5 text-sm text-slate-300" />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Sua Mensagem</label>
              <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} className="w-full bg-slate-900/80 border border-slate-600 rounded-lg p-2.5 text-sm text-slate-300"></textarea>
            </div>
            <button 
              type="submit" 
              disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-2 bg-gradient-red text-white font-bold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-gradient-to-r from-red-800 to-red-700 transition-all disabled:opacity-50 disabled:cursor-wait"
            >
              {status === 'sending' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Feedback
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};