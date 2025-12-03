from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .base.manager import ManagerAbstractBase
from ...db.models import ProjectOrm, BacklogOrm
from ...utils.logger import logger
from ...repositories import ProjectsRepository
from ...schemas import (
    ProjectSchema,
    ProjectSchemaCreateRequest,
    ProjectSchemaCreate,
    ProjectSchemaUpdateRequest,
    ProjectSchemaUpdate
)

class ProjectsManager(ManagerAbstractBase):
    def __init__(
        self,
        db_session: AsyncSession
    ) -> None:
        self._db_session = db_session
        self.dao = ProjectsRepository[ProjectSchema](db_session=db_session)

    async def update_model_from_schema(
        self, 
        project_id: str,
        schema: ProjectSchemaUpdateRequest,
        returning: str | None = None
    ) -> None:
        data = self._formatting_data(schema=schema)
        result = await self.dao.update_model(
            data=data,
            returning=returning,
            id__eq=project_id,
        )
        return result
    
    async def fetch_model(
        self, 
        **filters
    ) -> dict:
        await logger.write(f"Fetching project with filter {filters}")

        if response := await self.dao.fetch_model(**filters):  
            return response.model_dump()
        
    async def create_model_from_schema(self, schema: ProjectSchemaCreateRequest, user_id: str) -> str:
        return await super().create_model_from_schema(
            ProjectSchemaCreate(
                user_id=user_id,
                backlogs=[],
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
        await logger.write(f"Fetching projects with filter {filters}")
        if response := await self.dao.fetch_models(
            order_by=order_by,
            offset=offset,
            limit=limit,
            selectinload_opts=[
                selectinload(ProjectOrm.backlogs).selectinload(BacklogOrm.tasks)
            ],
            **filters
        ):
            return [obj.model_dump() for obj in response]
        
    async def delete_model(
        self,
        **filters
    ) -> None:
        await logger.write(f"Deleting project with filter {filters}")
        return await self.dao.delete_model(
            returning='id', **filters
        )
