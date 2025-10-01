import { Sparkles } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-slate-400 space-y-4 my-16">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-slate-700 rounded-full animate-spin" style={{borderTopColor: '#ef4444'}}></div>
        <Sparkles className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-red-light" />
      </div>
      <h3 className="text-xl font-semibold text-slate-200">Gerando Posts...</h3>
      <p className="max-w-sm">Nossa IA está criando seus posts e aprendendo com seu estilo. Isso pode levar um momento!</p>
    </div>
  );
};
