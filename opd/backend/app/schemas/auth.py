from pydantic import BaseModel

class VerifyRequest(BaseModel):
    init_data: str

class VerifyResponse(BaseModel): 
    status: str
    
class TokenData(BaseModel): 
    access_token: str
    refresh_token: str