from sqlalchemy.ext.asyncio import AsyncSession

from .base.manager import ManagerAbstractBase
from ...utils.logger import logger
from ...repositories import AdminRepository
from ...utils.hasher import Hasher
from ...schemas import (
    AdminSchema,
    AdminCreateHashedPassword,
    AdminCreateRequest,
)

class AdminManager(ManagerAbstractBase):
    
    def __init__(
            self, 
            db_session: AsyncSession
        ) -> None:
        super().__init__(db_session)
        self.dao = AdminRepository[AdminSchema](db_session=db_session)

    async def fetch_model(
        self, 
        **filters
    ) -> dict:
        await logger.write(f"Fetching admin with filter {filters}")
        if response := await self.dao.fetch_model(
            **filters
        ):
            return response
        
    async def fetch_models(
        self,
        order_by: str = None,
        offset: int = 0,
        **filters
    ) -> list[dict]:
        await logger.write(f"Fetching admins with filter {filters}")
        if response := await self.dao.fetch_models(
            order_by=order_by,
            offset=offset,
            limit=25,
            **filters
        ):
            return response

    async def create_model_from_schema(self, schema: AdminCreateRequest) -> str:
        admin_schema_hashed_password = AdminCreateHashedPassword(
            login=schema.login,
            hash_password=Hasher.get_password_hash(schema.password)
        )
        return await super().create_model_from_schema(admin_schema_hashed_password)
          
    async def delete_model(
        self, 
        admin_id: str
    ) -> None:
        await self.dao.delete_model(id__eq=admin_id)