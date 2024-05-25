from bson import ObjectId
from fastapi import HTTPException
from config.db import db
from bson.objectid import ObjectId


def serialize_blink_detection_result(item, username):
    return {
        "id": str(item["_id"]),
        "userId": str(item["userId"]),
        "username": username,
        "plot_image": item["plot_image"],
        "average_blink": item["average_blink"]
    }

def get_all_blink_detection_results():
    blink_results = []
    for result in db.get_collection("blink_detection_results").find():
        user = db.get_collection("users").find_one({"_id": ObjectId(result['userId'])})
        username = user['name'] if user else None
        serialized_result = serialize_blink_detection_result(result, username)
        blink_results.append(serialized_result)
    return blink_results

def get_latest_blink_detection_result(userId):
    blink_result = None
    cursor = db.get_collection("blink_detection_results").find({"userId": userId}).sort([("_id", -1)]).limit(1)
    for result in cursor:
        user = db.get_collection("users").find_one({"_id": ObjectId(result['userId'])})
        username = user['name'] if user else None
        blink_result = serialize_blink_detection_result(result, username)
        break
    return blink_result



