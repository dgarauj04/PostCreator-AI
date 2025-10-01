from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    mongo_uri_base = os.getenv('MONGO_URI')
    db_name = os.getenv('DB_NAME', 'postcreator')
    
    if not mongo_uri_base:
        final_mongo_uri = f"mongodb://localhost:27017/{db_name}"
        print(f"✅ Usando MONGO_URI local padrão: {final_mongo_uri}")
    else:
        uri_parts = mongo_uri_base.split('?')
        base = uri_parts[0].rstrip('/')
        final_mongo_uri = f"{base}/{db_name}"
        if len(uri_parts) > 1:
            final_mongo_uri += f"?{uri_parts[1]}"
        
        print(f"✅ MONGO_URI encontrada. Conectando ao banco '{db_name}'")

    app.config['MONGO_URI'] = final_mongo_uri
        
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'fallback_secret_key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))  
    
    from src.database import init_db, check_db_connection
    init_db(app)
    with app.app_context():
        check_db_connection()
    
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