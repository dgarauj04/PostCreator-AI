from datetime import datetime
from bson import ObjectId

class Post:
    @staticmethod
    def replace_user_posts(posts_collection, user_id, posts_data):
        posts_collection.delete_many({'user_id': ObjectId(user_id)})
        
        if not posts_data:
            return 0

        for post in posts_data:
            post['user_id'] = ObjectId(user_id)
            post.pop('_id', None)
        
        posts_collection.insert_many(posts_data)
        return len(posts_data)
    
    @staticmethod
    def save_user_posts(posts_collection, user_id, posts):
        posts_collection.delete_many({"user_id": ObjectId(user_id)})
        
        if posts:
            posts_data = []
            for post in posts:
                post_data = {
                    **post,
                    "user_id": ObjectId(user_id),
                    "saved_at": datetime.utcnow(),
                    "id": post.get('id')
                }
                posts_data.append(post_data)
            
            if posts_data:
                result = posts_collection.insert_many(posts_data)
                return len(result.inserted_ids)
        
        return 0

    @staticmethod
    def get_user_posts(posts_collection, user_id):
        posts = posts_collection.find({"user_id": ObjectId(user_id)}).sort("saved_at", -1)
        posts_list = []
        
        for post in posts:
            post_data = {
                "id": post.get("id"),
                "postText": post.get("postText"),
                "hashtags": post.get("hashtags", []),
                "imageVideoSuggestion": post.get("imageVideoSuggestion"),
                "platform": post.get("platform"),
                "improvementTips": post.get("improvementTips", []),
                "savedAt": post.get("savedAt"),
                "user_id": str(post.get("user_id"))
            }
            if "_id" in post:
                post_data["_id"] = str(post["_id"])
            posts_list.append(post_data)
        
        return posts_list

    @staticmethod
    def delete_user_post(posts_collection, post_id, user_id):
        result = posts_collection.delete_one({
            "id": post_id,
            "user_id": ObjectId(user_id)
        })
        return result.deleted_count > 0

    @staticmethod
    def update_post_text(posts_collection, post_id, user_id, new_text):
        result = posts_collection.update_one(
            {
                "id": post_id,
                "user_id": ObjectId(user_id)
            },
            {
                "$set": {
                    "postText": new_text,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0