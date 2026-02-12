from pymongo import MongoClient

client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["ai_medical_db"]

users_collection = db["users"]
appointments_collection = db["appointments"]
reports_collection = db["reports"]
