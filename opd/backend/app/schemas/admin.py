from pydantic import BaseModel

class AdminSchema(BaseModel):
    admin_id: str
    login: str
    hash_password: str
    created_at: str

class AdminCreateHashedPassword(BaseModel): 
    login: str
    hash_password: str
    
class AdminCreateRequest(BaseModel):
    login: str
    password: str

class AdminCreateResponse(BaseModel): 
    admin_id: str

class AdminGetResponse(AdminSchema): 
    pass