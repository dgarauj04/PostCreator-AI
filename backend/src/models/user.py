from datetime import datetime
from bson import ObjectId

class User:
    @staticmethod
    def create_user(users_collection, email, password, bcrypt, username=None):
        if users_collection.find_one({"email": email}):
            return None, "Email já está em uso"
        
        if username and users_collection.find_one({"username": username}):
            return None, "Nome de usuário já está em uso"
        
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        user_data = {
            "email": email,
            "username": username,
            "password": hashed_password,
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow()
        }
        
        result = users_collection.insert_one(user_data)
        return str(result.inserted_id), None

    @staticmethod
    def authenticate_user(users_collection, login_identifier, password, bcrypt):
        user = users_collection.find_one({"$or": [{"email": login_identifier}, {"username": login_identifier}]})
        
        if not user or not bcrypt.check_password_hash(user["password"], password):
            return None, "Email/nome de usuário ou senha inválidos"
        
        users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        return user, None

    @staticmethod
    def find_by_email(users_collection, email):
        return users_collection.find_one({"email": email})

    @staticmethod
    def find_by_id(users_collection, user_id):
        try:
            return users_collection.find_one({"_id": ObjectId(user_id)})
        except:
            return None