import React, { useState } from 'react';
import { Linkedin, Github, Instagram, Briefcase, MessageSquare } from 'lucide-react';
import { Feedback } from './Feedback';

const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/douglas-araujo-dgprogdev',
    icon: <Linkedin size={20} />,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/dgarauj04',
    icon: <Github size={20} />,
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/dgaraujoo_',
    icon: <Instagram size={20} />,
  },
  {
    name: 'Portfolio',
    url: 'https://dgaraujo-dev.vercel.app/',
    icon: <Briefcase size={20} />,
  },
];

export const Footer: React.FC = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-slate-900/50 border-t border-slate-800 py-8 relative">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <div className="flex justify-center items-center gap-6 mb-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="text-slate-400 hover:text-red-500 transition-colors duration-300"
              >
                {link.icon}
              </a>
            ))}
          </div>
          <p className="mb-2 text-sm">Desenvolvido por Douglas Araujo</p>
          <p className="text-xs text-slate-500">&copy; {currentYear} PostCreator AI. Todos os direitos reservados.</p>
        </div>
        <button
          onClick={() => setIsFeedbackOpen(true)}
          title="Enviar Feedback"
          aria-label="Abrir formulário de feedback"
          className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-300 bg-slate-800/80 border border-slate-700 rounded-full hover:bg-slate-700 hover:text-white transition-all duration-300 shadow-lg"
        >
          <MessageSquare size={16} />
          <span className="hidden sm:inline">Feedback</span>
        </button>
      </footer>
      {isFeedbackOpen && (
        <Feedback
          isOpen={isFeedbackOpen} 
          onClose={() => setIsFeedbackOpen(false)} 
        />
      )}
    </>
  );
};
