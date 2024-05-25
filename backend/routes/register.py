from fastapi import APIRouter
from controllers.register import create_user, login_user
from models.register import Register, LoginRequest

register = APIRouter()

@register.post("/register/")
async def register_user(register_info: Register):
    return create_user(register_info)

@register.post("/login/")
async def login(login_info: LoginRequest):
    return login_user(login_info)
