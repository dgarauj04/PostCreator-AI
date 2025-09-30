from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.database import mongo
from src.models.post import Post
from src.models.user import User

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('/api/posts', methods=['POST'])
@jwt_required()
def save_posts():
    try:
        current_user_id = get_jwt_identity()
        user = User.find_by_id(mongo.db.users, current_user_id)
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404

        data = request.get_json()
        if not isinstance(data, dict) or 'posts' not in data or not isinstance(data['posts'], list):
            return jsonify({'error': 'Dados de posts são obrigatórios'}), 400
        
        posts = data['posts']
        
        Post.replace_user_posts(mongo.db.posts, current_user_id, posts) 
        
        return jsonify({
            'message': f'{len(posts)} posts sincronizados com sucesso.',
            'count': len(posts)
        }), 201
        
    except Exception as e:
        print(f"Erro ao salvar posts: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@posts_bp.route('/api/posts', methods=['GET'])
@jwt_required()
def get_user_posts():
    try:
        current_user_id = get_jwt_identity()
        user = User.find_by_id(mongo.db.users, current_user_id)
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404

        posts = Post.get_user_posts(mongo.db.posts, current_user_id)
        
        return jsonify(posts), 200
        
    except Exception as e:
        print(f"Erro ao obter posts: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@posts_bp.route('/api/posts/<post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.find_by_id(mongo.db.users, current_user_id)
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404

        success = Post.delete_user_post(mongo.db.posts, post_id, current_user_id)
        
        if not success:
            return jsonify({'error': 'Post não encontrado ou não autorizado'}), 404
        
        return jsonify({'message': 'Post deletado com sucesso'}), 200
        
    except Exception as e:
        print(f"Erro ao deletar post: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@posts_bp.route('/api/posts/<post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.find_by_id(mongo.db.users, current_user_id)
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404

        data = request.get_json()
        
        if not data or 'postText' not in data:
            return jsonify({'error': 'Texto do post é obrigatório'}), 400
        
        new_text = data['postText']
        success = Post.update_post_text(mongo.db.posts, post_id, current_user_id, new_text)
        
        if not success:
            return jsonify({'error': 'Post não encontrado ou não autorizado'}), 404
        
        return jsonify({'message': 'Post atualizado com sucesso'}), 200
        
    except Exception as e:
        print(f"Erro ao atualizar post: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor'}), 500