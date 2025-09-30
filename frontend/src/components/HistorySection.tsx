import React, { useState, useMemo } from 'react';
import type { SavedPost } from '../types/types';
import { SocialPlatform } from '../types/types';
import { Trash2, Calendar, Tags, History, Pencil, Save, X, AlertTriangle, Camera } from 'lucide-react';

interface HistorySectionProps {
  savedPosts: SavedPost[];
  onDeletePost: (id: string) => void;
  onEditPost: (id: string, newText: string) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({ savedPosts, onDeletePost, onEditPost }) => {
  const [activeFilter, setActiveFilter] = useState<SocialPlatform | 'All'>('All');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    const sorted = [...savedPosts].sort((a, b) => b.savedAt - a.savedAt);
    if (activeFilter === 'All') return sorted;
    return sorted.filter(post => post.platform === activeFilter);
  }, [savedPosts, activeFilter]);

  const handleEditClick = (post: SavedPost) => {
    setEditingPostId(post.id);
    setEditedText(post.postText);
  };

  const handleSaveClick = (id: string) => {
    onEditPost(id, editedText);
    setEditingPostId(null);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
  }

  const handleDeleteConfirm = (id: string) => {
    onDeletePost(id);
    setShowDeleteConfirm(null);
  }

  if (savedPosts.length === 0) {
    return (
      <div className="text-center text-slate-500 py-16 max-w-lg mx-auto min-h-[300px] flex flex-col justify-center items-center">
        <History className="w-16 h-16 mx-auto text-slate-600 mb-4" />
        <h3 className="text-xl font-semibold text-slate-300">Seu Histórico Está Vazio</h3>
        <p>Os posts que você salvar aparecerão aqui. Isso ajuda a nossa IA a aprender seu estilo para futuras gerações!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">
        Histórico de Posts Salvos
      </h2>
      <p className="text-center text-slate-400 mb-8">Estes posts são usados para ensinar a IA sobre seu estilo de escrita.</p>

      <div className="flex justify-center flex-wrap gap-2 mb-8">
        <button onClick={() => setActiveFilter('All')} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeFilter === 'All' ? 'bg-brand-red-light text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
          Todos
        </button>
        {Object.values(SocialPlatform).map(platform => (
          <button key={platform} onClick={() => setActiveFilter(platform)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeFilter === platform ? 'bg-brand-red-light text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
            {platform}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 flex flex-col md:flex-row gap-4 items-start animate-fade-in">
              <div className="w-full md:w-40 flex-shrink-0 bg-slate-900/50 rounded-md p-3 border border-slate-700">
                  <div className="flex items-center mb-2 text-xs text-sky-400 font-semibold">
                      <Camera size={14} className="mr-2" />
                      <span>Sugestão Visual</span>
                  </div>
                  <p className="text-xs text-slate-400 italic">"{post.imageVideoSuggestion}"</p>
              </div>
              <div className="flex-grow">
                {editingPostId === post.id ? (
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm text-slate-300 focus:ring-2 focus:ring-brand-red-light"
                  />
                ) : (
                  <p className="text-slate-300 whitespace-pre-wrap">{post.postText}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-700">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.savedAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Tags size={14} /> {post.platform}</span>
                </div>
              </div>
              <div className="flex-shrink-0 flex md:flex-col gap-2">
                {editingPostId === post.id ? (
                  <>
                    <button onClick={() => handleSaveClick(post.id)} title="Salvar" className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-700 rounded-full transition-colors">
                      <Save size={18} />
                    </button>
                    <button onClick={handleCancelEdit} title="Cancelar" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleEditClick(post)} title="Editar" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
                    <Pencil size={18} />
                  </button>
                )}
                <button onClick={() => setShowDeleteConfirm(post.id)} title="Excluir" className="p-2 text-slate-500 hover:text-brand-red-light hover:bg-slate-700 rounded-full transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 py-8">Nenhum post salvo para esta plataforma.</p>
        )}
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
           <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-sm w-full mx-4 animate-fade-in">
                <div className="flex items-center">
                    <div className="bg-red-900/50 p-2 rounded-full mr-4">
                        <AlertTriangle className="text-brand-red-light" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Confirmar Exclusão</h3>
                        <p className="text-sm text-slate-400">Tem certeza de que deseja excluir este post? Esta ação não pode ser desfeita.</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 text-sm font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button onClick={() => handleDeleteConfirm(showDeleteConfirm)} className="px-4 py-2 text-sm font-semibold text-white bg-brand-red-dark hover:bg-brand-red-light rounded-lg transition-colors">
                        Excluir
                    </button>
                </div>
           </div>
        </div>
      )}
    </div>
  )
};