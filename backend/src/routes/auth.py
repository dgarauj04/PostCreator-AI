from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.database import mongo, bcrypt
from src.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password') or not data.get('username'):
            return jsonify({'error': 'Email, nome de usuário e senha são obrigatórios'}), 400
        
        email = data['email'].strip().lower()
        username = data['username'].strip().lower()
        password = data['password']
        
        if len(password) < 6:
            return jsonify({'error': 'A senha deve ter pelo menos 6 caracteres'}), 400
        
        user_id, error = User.create_user(mongo.db.users, email, password, bcrypt, username)
        
        if error:
            return jsonify({'error': error}), 400
        
        access_token = create_access_token(identity=user_id)
        
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'access_token': access_token,
            'user': {'email': email, 'username': username, 'id': user_id}
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Erro no registro: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('login_identifier') or not data.get('password'):
            return jsonify({'error': 'Email/nome de usuário e senha são obrigatórios'}), 400
        
        login_identifier = data['login_identifier'].strip().lower()
        password = data['password']
        
        user, error = User.authenticate_user(mongo.db.users, login_identifier, password, bcrypt)
        
        if error:
            return jsonify({'error': error}), 401
        
        access_token = create_access_token(identity=str(user['_id']))
        
        return jsonify({
            'message': 'Login realizado com sucesso',
            'access_token': access_token,
            'user': {'email': user['email'], 'username': user.get('username'), 'id': str(user['_id'])}
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Erro no login: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@auth_bp.route('/api/auth/verify', methods=['GET'])
@jwt_required()
def verify_token():
    try:
        current_user_id = get_jwt_identity()
        user = User.find_by_id(mongo.db.users, current_user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        return jsonify({
            'user': {'email': user['email'], 'username': user.get('username'), 'id': str(user['_id'])}
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Erro na verificação: {str(e)}")
        return jsonify({'error': 'Token inválido'}), 401

@auth_bp.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        current_user_id = get_jwt_identity()
        user = User.find_by_id(mongo.db.users, current_user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        user_data = {
            'email': user['email'],
            'username': user.get('username'),
            'created_at': user.get('created_at'),
            'last_login': user.get('last_login'),
            'id': str(user['_id'])
        }
        
        return jsonify({'user': user_data}), 200
        
    except Exception as e:
        current_app.logger.error(f"Erro ao obter dados do usuário: {str(e)}")
        return jsonify({'error': 'Erro ao obter dados do usuário'}), 500