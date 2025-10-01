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
        mongo.db.command('ping')
        print("✅ Conectado ao MongoDB com sucesso!")
        print(f"📊 Database: {mongo.db.name}")
    except Exception as e:
        print(f"❌ Erro ao conectar com MongoDB: {e}")