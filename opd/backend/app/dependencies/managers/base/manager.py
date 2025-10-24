from abc import ABC
from abc import abstractmethod

from sqlalchemy.ext.asyncio import AsyncSession

from pydantic import BaseModel

from ....db.orm.dao import DataAccessObject


class ManagerAbstractBase(ABC):
    
    def __init__(
        self,
        db_session: AsyncSession
    ) -> None:
        self._transaction = db_session
        self.dao = DataAccessObject(db_session=db_session)
    
    # @abstractmethod
    async def fetch_model():
        pass
    
    # @abstractmethod
    async def fetch_models() -> list[dict] | None:
        pass

    # @abstractmethod
    async def insert_models():
        pass

    # @abstractmethod
    async def update_model_from_schema():
        pass
    
    # @abstractmethod
    async def update_models():
        pass
    
    # @abstractmethod
    async def delete_model():
        pass
    
    def _formatting_data(self, schema: BaseModel) -> dict:
        data = schema.model_dump(exclude_none=True)
        return data
    
    async def create_model_from_schema(self, schema: BaseModel, returning: str = "id") -> str:
        data = self._formatting_data(schema=schema)
        if response := await self.dao.create_model(data, returning):
            return str(response)
    
    async def sum_(
        self,
        sum_attr: str,
        **filters
    ) -> float:
        if response := await self.dao.sum_(
            sum_attr=sum_attr,
            **filters
        ):
            return response
        return 0
    
    async def count(
        self,
        **filters
    ) -> int:
        return await self.dao.count(**filters)

        
    
    
