import { useState, useCallback, useEffect, useRef } from 'react';
import { PostForm } from '../components/PostForm';
import { Header } from '../components/Header';
import { PostCard } from '../components/PostCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { HistorySection } from '../components/HistorySection';
import { Footer } from '../components/Footer';
import { generatePostSuggestions } from '../services/geminiService';
import { authService } from '../services/authService';
import type { PostSuggestion, PostFormState, SavedPost } from '../types/types';
import { ArrowDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type View = 'home' | 'history';

function Home() {
  const { token } = useAuth();
  const [view, setView] = useState<View>('home');
  const [postSuggestions, setPostSuggestions] = useState<PostSuggestion[]>([]);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) return;
      try {
        const posts = await authService.getUserPosts(token);
        setSavedPosts(posts);
      } catch (error) {
        console.error("Failed to load saved posts from backend", error);
      }
    };
    fetchPosts();
  }, [token]);

  useEffect(() => {
    const currentRef = resultsRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShowScrollButton(false);
      }
    }, {
      root: null,
      threshold: 0.1,
    });

    observer.observe(currentRef);

    return () => observer.unobserve(currentRef);
  }, [isLoading]); 

  const savePost = useCallback(async (post: PostSuggestion) => {
    if (!token) return;

    if (savedPosts.some(p => p.id === post.id)) {
      console.log("Post já salvo, ignorando duplicata.");
      return; 
    }

    const newPost: SavedPost = {
      ...post,
      id: post.id || crypto.randomUUID(), 
      savedAt: Date.now(),
    };

    const updatedPosts = [...savedPosts, newPost];
    
    try {
      await authService.saveUserPosts(updatedPosts, token);
      setSavedPosts(updatedPosts);
    } catch (err) {
      console.error("Failed to save posts", err);
    }
  }, [savedPosts, token]);

  const deletePost = useCallback(async (id: string) => {
    if (!token) return;
    const updatedPosts = savedPosts.filter(p => p.id !== id);
    try {
      await authService.saveUserPosts(updatedPosts, token);
      setSavedPosts(updatedPosts);
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  }, [savedPosts, token]);

  const editPost = useCallback(async (id: string, newText: string) => {
    setSavedPosts(prevPosts => {
      const updatedPosts = prevPosts.map(p =>
        p.id === id ? { ...p, postText: newText } : p
      );
      if (token) {
        authService.saveUserPosts(updatedPosts, token)
          .then(() => console.log("Post editado e salvo com sucesso."))
          .catch(err => console.error("Failed to save edited post", err));
      }
      return updatedPosts;
    });
  }, [token]);

  const formSubmit = useCallback(async (formData: PostFormState) => {
    setIsLoading(true);
    setError(null);
    setPostSuggestions([]);
    setShowScrollButton(false);

    const examplePosts = savedPosts
      .filter(p => p.platform === formData.platform)
      .sort((a, b) => b.savedAt - a.savedAt)
      .slice(0, 3)
      .map(p => p.postText);

    try {
      if (!token) {
        throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
      }
      const suggestions = await generatePostSuggestions(formData, examplePosts, token);
      const suggestionsWithIdAndPlatform = suggestions.map(s => ({
        ...s, id: crypto.randomUUID(), platform: formData.platform
      }));
      setPostSuggestions(suggestionsWithIdAndPlatform);
      
      if (suggestions.length > 0) {
        setTimeout(() => setShowScrollButton(true), 100);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Erro ao gerar posts. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [savedPosts, token]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      <Header currentView={view} setView={setView} />

      <main className="container mx-auto px-4 flex-grow w-full">
        {view === 'home' && (
          <>
            <section className="max-w-3xl mx-auto w-full my-8">
              <PostForm onSubmit={formSubmit} isLoading={isLoading} />
            </section>
            
            <div ref={resultsRef} className="py-8 md:py-6">
              {isLoading && <LoadingSpinner />}
              
              {error && (
                <div className="max-w-3xl mx-auto bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
                  <p className="font-bold">Falha na Geração</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {!isLoading && postSuggestions.length > 0 && (
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-brand-red-light via-red-400 to-amber-300 text-transparent bg-clip-text">
                    Seus Posts Gerados por IA
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {postSuggestions.map((suggestion, index) => (
                      <PostCard 
                        key={suggestion.id} 
                        suggestion={suggestion} 
                        index={index} 
                        onSavePost={savePost} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {view === 'history' && (
            <HistorySection 
                savedPosts={savedPosts} 
                onDeletePost={deletePost}
                onEditPost={editPost}
            />
        )}
      </main>
      
      <Footer />
      
      {showScrollButton && (
        <button
            onClick={() => {
              resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
              setShowScrollButton(false); 
            }}
            className="fixed bottom-6 right-6 bg-brand-red-light text-white p-3 rounded-full shadow-lg hover:bg-brand-red-dark transition-all duration-300 hover:scale-110 z-50 animate-fade-in"
            aria-label="Rolar para os resultados"
        >
            <ArrowDown className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default Home;