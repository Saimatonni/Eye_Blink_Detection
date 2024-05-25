from pydantic import BaseModel

class Register(BaseModel):
    name: str
    email: str
    password: str
    type: str
    
class LoginRequest(BaseModel):
    email: str
    password: str