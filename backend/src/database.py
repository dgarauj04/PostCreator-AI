from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import certifi

mongo = PyMongo()
bcrypt = Bcrypt()
jwt = JWTManager()

def init_db(app):
    connect_args = {}
    
    if "mongodb+srv" in app.config.get("MONGO_URI", ""):
        connect_args['tls'] = True
        connect_args['tlsCAFile'] = certifi.where()
        
    mongo.init_app(app, **connect_args)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    try:
        if mongo.cx is None:
            print("❌ Conexão com MongoDB falhou na inicialização (mongo.cx is None). Verifique a MONGO_URI.")
            return 

        print("ℹ️ Tentando enviar comando 'ping' para o MongoDB...")
        mongo.db.command('ping')
        print("✅ Conectado ao MongoDB com sucesso!")
        print(f"📊 Database: {mongo.db.name}")
    except Exception as e:
        import traceback
        print(f"❌ Erro detalhado ao conectar com MongoDB: {e}")
        print("--- Traceback completo ---")
        traceback.print_exc()
        print("-------------------------")