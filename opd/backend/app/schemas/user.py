from typing import Optional

from pydantic import BaseModel

from .auth import TokenData

class UserSchema(BaseModel):
    user_id: str
    login: str
    email: str
    password_hash: str
    name: str
    last_name: str
    company_name: str
    earnings: float
    projects_ids: list[str]

class UserUpdate(BaseModel):
    login: Optional[str] = None
    email: Optional[str] = None
    password_hash: Optional[str] = None
    name: Optional[str] = None
    last_name: Optional[str] = None
    company_name: Optional[str] = None
    earnings: Optional[float] = None
    projects_ids: Optional[list[str]] = None

class UserSchemaCreate(BaseModel):
    login: str
    email: str
    password_hash: str
    name: str
    last_name: str
    company_name: str

class UserLoginRequest(BaseModel):
    login: Optional[str] = None
    email: Optional[str] = None
    password: str
    
class UserLoginResponse(BaseModel):
    status: str

class UserRegisterRequest(BaseModel):
    email: str
    login: str
    password: str
    name: str
    last_name: str
    company_name: str

class UserRegisterResponse(BaseModel):
    status: int

class UserLogout(BaseModel):
    status: int

class UserMeResponse(BaseModel):
    login: str
    email: str
    user_id: str
    name: str
    last_name: str
    company_name: str
    earnings: float
    projects_ids: list[str]

# class UserGetResponse(UserSchema): 
#     pass

# class UserRegisterRequest(UserSchema):
#     pass

# class UserUpdate(BaseModel): 
#     pass