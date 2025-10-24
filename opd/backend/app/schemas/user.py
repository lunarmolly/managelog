from typing import Optional

from pydantic import BaseModel

from .auth import TokenData

class UserSchema(BaseModel):
    user_id: str
    login: str
    email: str
    password_hash: str

class UserSchemaCreate(BaseModel):
    login: str
    email: str
    password_hash: str

class UserLoginRequest(BaseModel):
    login: Optional[str] = None
    email: Optional[str] = None
    password: str
    
class UserLoginResponse(BaseModel):
    status: int
    tokens: Optional[TokenData]

class UserRegisterRequest(BaseModel):
    email: str
    login: str
    password: str

class UserRegisterResponse(BaseModel):
    status: int

class UserLogout(BaseModel):
    status: int

# class UserGetResponse(UserSchema): 
#     pass

# class UserRegisterRequest(UserSchema):
#     pass

# class UserUpdate(BaseModel): 
#     pass