import os
import google.generativeai as genai
from flask import Blueprint, request, jsonify, current_app
import json
from flask_jwt_extended import jwt_required

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/api/ai/generate-post', methods=['POST'])
@jwt_required()
def generate_post():
    
    try:
        api_key = os.environ.get('GEMINI_API_KEY')
        if not api_key:
            current_app.logger.error("GEMINI_API_KEY não está configurada no servidor.")
            return jsonify({'error': 'Configuração do servidor incompleta.'}), 500

        genai.configure(api_key=api_key)

        data = request.get_json()
        form_data = data.get('formData')
        example_posts = data.get('examplePosts', [])

        if not form_data or not form_data.get('theme'):
            return jsonify({'error': 'O tema do post é obrigatório.'}), 400

        theme = form_data.get('theme')
        platform = form_data.get('platform')
        tone = form_data.get('tone')
        number_of_suggestions = 4

        learning_prompt = ""
        if example_posts:
            examples_str = "\n".join([f'- Exemplo {i + 1}: "{p}"' for i, p in enumerate(example_posts)])
            learning_prompt = f"""
Para sua referência, aqui estão alguns exemplos de posts que o usuário salvou anteriormente. Tente imitar o estilo, tom e estrutura deles ao criar as novas sugestões:
{examples_str}
"""

        prompt = f"""
            Você é um assistente especialista em marketing de mídias sociais chamado PostGenius AI.
            Sua tarefa é gerar {number_of_suggestions} variações de posts de mídia social atraentes em Português (Brasil).

            Detalhes:
            - Plataforma de Mídia Social: {platform}
            - Tópico/Tema: {theme}
            - Tom de Voz Desejado: {tone}

            {learning_prompt}

            Para cada variação, forneça:
            1. postText: O conteúdo principal do post, perfeitamente otimizado para a plataforma {platform}. A resposta deve ser em Português do Brasil ao menos que o usuário especifique outro idioma. Use separações de parágrafos, estrofes, parágrafos, quebras de linha e emojis relevantes para aumentar o engajamento e a legibilidade.
            2. hashtags: Um array de 7 a 10 hashtags relevantes e eficazes em português, misturando hashtags populares e de nicho.
            3. improvementTips: Um array de 2 a 3 sugestões curtas e acionáveis (com no máximo 10 palavras cada) para melhorar o post.
            4. imageVideoSuggestion: Uma sugestão curta e criativa (máximo de 25 palavras) para uma imagem ou vídeo que combine com o post.

            IMPORTANTE: Sua resposta final DEVE ser um array JSON contendo {number_of_suggestions} objetos, onde cada objeto representa uma sugestão de post.
            Exemplo de formato de saída: `[ {{...sugestão 1...}}, {{...sugestão 2...}} ]`
        """

        generation_config = genai.types.GenerationConfig(
            response_mime_type="application/json"
        )
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt, generation_config=generation_config)

        if not response.parts:
             current_app.logger.error("A resposta da IA do Gemini não contém 'parts'.")
             raise ValueError("A resposta da IA não contém conteúdo válido.")
        
        response_text = response.parts[0].text
        json_response = json.loads(response_text)
        
        return jsonify(json_response), 200

    except Exception as e:
        current_app.logger.error(f"Erro ao gerar conteúdo com IA: {str(e)}")
        return jsonify({'error': 'Falha ao gerar conteúdo. Tente novamente mais tarde.'}), 500
        