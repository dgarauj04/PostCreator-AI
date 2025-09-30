import React, { useState, useEffect } from 'react';
import type { PostSuggestion } from '../types/types';
import { ClipboardCopy, Check, Pencil, Save, Bookmark, Lightbulb, Camera } from 'lucide-react';

interface PostCardProps {
  suggestion: PostSuggestion;
  index: number;
  onSavePost: (post: PostSuggestion) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ suggestion, index, onSavePost }) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(suggestion.postText);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setEditedText(suggestion.postText);
    setIsEditing(false);
  }, [suggestion.postText]);

  const clickCopy = (textToCopy: string, type: 'text' | 'hashtags') => {
    navigator.clipboard.writeText(textToCopy);
    if (type === 'text') {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } else {
      setCopiedHashtags(true);
      setTimeout(() => setCopiedHashtags(false), 2000);
    }
  };

  const saveClick = () => {
    const postToSave = {
        ...suggestion,
        id: suggestion.id, 
        postText: editedText,
    };
    onSavePost(postToSave);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  }

  const handleEditToggle = () => {
    setIsEditing(prev => !prev);
  };
  
  const animationDelay = `${index * 100}ms`;

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 flex flex-col animate-fade-in" style={{ animationDelay }}>
      <div className="p-4 border-b border-slate-700 bg-slate-900/50 min-h-[100px] flex flex-col justify-center">
          <div className="flex items-center mb-2">
              <Camera className="w-5 h-5 text-sky-400 mr-3 flex-shrink-0" />
              <h3 className="text-md font-semibold text-slate-200">Sugestão de Imagem/Vídeo</h3>
          </div>
          <p className="text-sm text-slate-400 italic">"{suggestion.imageVideoSuggestion}"</p>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-slate-200">Conteúdo do Post</h3>
          <div className="flex gap-2">
            <button title="Salvar post no histórico" onClick={saveClick} className="text-slate-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-slate-700">
               {isSaved ? <Check className="w-5 h-5 text-green-400" /> : <Bookmark className="w-5 h-5" />}
             </button>
             <button title={isEditing ? "Salvar edição" : "Editar texto"} onClick={handleEditToggle} className="text-slate-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-slate-700">
               {isEditing ? <Save className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
             </button>
             <button title="Copiar texto" onClick={() => clickCopy(editedText, 'text')} className="text-slate-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-slate-700">
               {copiedText ? <Check className="w-5 h-5 text-green-400" /> : <ClipboardCopy className="w-5 h-5" />}
             </button>
          </div>
        </div>

        {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full h-40 bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm text-slate-300 focus:ring-2 focus:ring-brand-red-light"
            />
        ) : (
            <p className="text-sm text-slate-300 whitespace-pre-wrap flex-grow">{editedText}</p>
        )}
        
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-md font-semibold text-slate-200">Hashtags</h4>
            <button title="Copiar hashtags" onClick={() => clickCopy(suggestion.hashtags.join(' '), 'hashtags')} className="text-slate-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-slate-700">
              {copiedHashtags ? <Check className="w-5 h-5 text-green-400" /> : <ClipboardCopy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {suggestion.hashtags.join(' ')}
          </p>
        </div>

        {suggestion.improvementTips && suggestion.improvementTips.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center mb-2">
                    <Lightbulb className="w-5 h-5 text-amber-300 mr-2" />
                    <h4 className="text-md font-semibold text-slate-200">Sugestões de Melhoria</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                    {suggestion.improvementTips.map((tip, i) => (
                        <span key={i} className="text-xs bg-amber-900/50 text-amber-300 px-2 py-1 rounded-full">
                            {tip}
                        </span>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
