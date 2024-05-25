from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

mongo_db_url = os.getenv("MONGO_DB_URL")

class MongoDB:
    def __init__(self, db_url):
        self.client = MongoClient(db_url)
        self.db = self.client.get_default_database() 

    def get_collection(self, collection_name):
        return self.db[collection_name]

db = MongoDB(mongo_db_url)
