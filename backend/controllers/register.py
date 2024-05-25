from bson import ObjectId
from fastapi import HTTPException
from config.db import db
from models.register import Register, LoginRequest
from schemas.register import serializeDict, serializeList
from fastapi.responses import JSONResponse
from utils.security import hash_password, verify_password


def create_user(register_info: Register):
    try:
        register_info.password = hash_password(register_info.password)
        db.get_collection("users").insert_one(register_info.dict())
        return JSONResponse(content={"message": "User created successfully"}, status_code=201)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def login_user(login_info: LoginRequest):
    user = db.get_collection("users").find_one({"email": login_info.email})
    if user:
        if verify_password(login_info.password, user['password']):
            user_id = str(user['_id'])
            user_type = user['type']
            return JSONResponse(content={"message": "Login successful", "data": {"userid": user_id, "type": user_type}}, status_code=201)
        else:
            raise HTTPException(status_code=401, detail="Incorrect password")
    else:
        raise HTTPException(status_code=404, detail="User not found")


