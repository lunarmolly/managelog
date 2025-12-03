from pydantic import BaseModel
from sqlalchemy.orm import DeclarativeBase

class Model(DeclarativeBase):
    
    async def to_pydantic(self) -> BaseModel:
        pass

    