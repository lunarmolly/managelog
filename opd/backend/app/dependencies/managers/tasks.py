from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from .base.manager import ManagerAbstractBase
from ...utils.logger import logger
from ...repositories import TasksRepository
from ...schemas import (
    TaskSchema,
    TaskSchemaCreate,
    TaskUpdate,
    TaskSchemaCreateRequest
)

class TasksManager(ManagerAbstractBase):
    def __init__(
        self,
        db_session: AsyncSession
    ) -> None:
        self._db_session = db_session
        self.dao = TasksRepository[TaskSchema](db_session=db_session)

    async def update_model_from_schema(
        self, 
        task_id: str,
        schema: TaskUpdate,
        returning: str | None = None
    ) -> None:
        data = self._formatting_data(schema=schema)
        result = await self.dao.update_model(
            data=data,
            returning=returning,
            id__eq=task_id,
        )
        return result
    
    async def fetch_model(
        self, 
        **filters
    ) -> dict:
        await logger.write(f"Fetching backlog with filter {filters}")

        if response := await self.dao.fetch_model(**filters):  
            return response.model_dump()
        
    async def create_model_from_schema(self, schema: TaskSchemaCreateRequest) -> str:
        return await super().create_model_from_schema(
            TaskSchemaCreate(
                **schema.model_dump(),
            )
        )

    async def fetch_models(
        self,
        order_by: str = None,
        offset: int = 0,
        limit: int = 25,
        **filters
    ) -> list[dict]:
        await logger.write(f"Fetching backlog with filter {filters}")
        if response := await self.dao.fetch_models(
            order_by=order_by,
            offset=offset,
            limit=limit,
            **filters
        ):
            return [obj.model_dump() for obj in response]
        
    async def delete_model(
        self,
        **filters
    ) -> None:
        await logger.write(f"Deleting backlog with filter {filters}")
        return await self.dao.delete_model(
            returning='id', **filters
        )