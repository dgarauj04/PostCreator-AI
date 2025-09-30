import { api } from './api'; 
import type { PostFormState, PostSuggestion } from '../types/types';

/**
 * Chama o endpoint seguro do backend para gerar sugestões de posts.
 * @param formData - Os dados do formulário (tema, plataforma, tom).
 * @param examplePosts - Uma lista de posts salvos pelo usuário para aprendizado de estilo.
 * @param token - O token JWT do usuário para autenticação.
 * @returns Uma promessa que resolve para um array de sugestões de post.
 */
export const generatePostSuggestions = async (
  formData: PostFormState, 
  examplePosts: string[],
  token: string
): Promise<PostSuggestion[]> => {
  try {
    const response = await api.post('/ai/generate-post', 
      {
        formData,
        examplePosts
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    let result = response.data;
    
    // Se a resposta for um objeto e não um array, tente encontrar o array dentro dele.
    // Isso torna o código mais robusto a variações na resposta da IA.
    if (typeof result === 'object' && !Array.isArray(result) && result !== null) {
      const key = Object.keys(result).find(k => Array.isArray(result[k]));
      if (key) {
        result = result[key];
      }
    }

    if (!Array.isArray(result) || result.length === 0) {
        throw new Error("A IA não retornou sugestões válidas.");
    }
    
    return result;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      console.error("Erro do backend ao gerar conteúdo:", error.response.data.error);
      throw new Error(error.response.data.error);
    }
    console.error("Erro ao chamar o backend para gerar conteúdo:", error);
    throw new Error("Falha ao comunicar com o servidor para gerar o post. Tente novamente.");
  }
};