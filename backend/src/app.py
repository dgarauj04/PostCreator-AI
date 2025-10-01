from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

import certifi

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    mongo_uri = os.getenv('MONGO_URI')
    db_name = os.getenv('DB_NAME', 'postcreator')

    if not mongo_uri:
        app.config['MONGO_URI'] = f"mongodb://localhost:27017/{db_name}"
    elif "mongodb+srv" in mongo_uri:
        app.config['MONGO_URI'] = f"{mongo_uri.split('?')[0].rstrip('/')}/{db_name}?{mongo_uri.split('?')[1] if '?' in mongo_uri else ''}&tls=true&tlsCAFile={certifi.where()}"
    else:
        app.config['MONGO_URI'] = f"{mongo_uri.rstrip('/')}/{db_name}"
        
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'fallback_secret_key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))  
    
    from src.database import init_db
    init_db(app)
    
    origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000, http://localhost:5000').split(',')
    CORS(app, origins=origins)
    
    from src.routes.auth import auth_bp
    from src.routes.posts import posts_bp
    from src.routes.ai_generator import ai_bp 
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(posts_bp)
    app.register_blueprint(ai_bp) 
    
    @app.route('/api/health')
    def health_check():
        return jsonify({'status': 'OK', 'message': 'PostCreator AI API está funcionando!'})
    
    return app