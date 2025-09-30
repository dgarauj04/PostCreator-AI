import React, { useState } from 'react';
import { SocialPlatform, ToneOfVoice } from '../types/types';
import type { PostFormState } from '../types/types';
import { Wand2 } from 'lucide-react';

interface PostFormProps {
  onSubmit: (formData: PostFormState) => void;
  isLoading: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PostFormState>({
    theme: '',
    platform: SocialPlatform.Instagram,
    tone: ToneOfVoice.Friendly,
  });

  const change = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.theme.trim()) {
        alert("Por favor, insira um tema ou descrição para o seu post.");
        return;
    }
    onSubmit(formData);
  };

  return (
    <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-sm">
      <form onSubmit={submit} className="space-y-6">
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-slate-300 mb-2">
            Sobre o que é o seu post?
          </label>
          <textarea
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={change}
            rows={4}
            className="w-full bg-slate-900/80 border border-slate-600 rounded-lg p-3 transition-all duration-200 placeholder-slate-500 text-slate-300 scroll-form"
            placeholder="Ex: Promoção de inverno para casacos de lã, 20% de desconto nas próximas 48 horas!"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-slate-300 mb-2">
              Plataforma Social
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={change}
              className="w-full bg-slate-900/80 border border-slate-600 rounded-lg p-3 transition-all duration-200 text-slate-300"
              disabled={isLoading}
            >
              {Object.values(SocialPlatform).map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-2">
              Tom de Voz
            </label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={change}
              className="w-full bg-slate-900/80 border border-slate-600 rounded-lg p-3 transition-all duration-200 text-slate-300"
              disabled={isLoading}
            >
              {Object.values(ToneOfVoice).map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-gradient-red text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
             'Gerando...'
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Gerar Posts
            </>
          )}
        </button>
      </form>
    </div>
  );
};
