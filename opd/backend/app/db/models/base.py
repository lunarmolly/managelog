from pydantic import BaseModel
from sqlalchemy.orm import DeclarativeBase

class Model(DeclarativeBase):
    
    def to_pydantic(self) -> BaseModel:
        pass

    