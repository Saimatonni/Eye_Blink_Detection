from fastapi import FastAPI
from routes.user import user 
from routes.register import register
from routes.eye_Blink import eye_blink
from routes.detect_Blink import detect_blink
from routes.retrive_blink_data import detect_data
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
# app.include_router(user)
app.include_router(register)
app.include_router(eye_blink)
app.include_router(detect_blink)
app.include_router(detect_data)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
