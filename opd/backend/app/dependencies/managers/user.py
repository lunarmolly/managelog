from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from .base.manager import ManagerAbstractBase
from ...utils.logger import logger
from ...utils.hasher import Hasher
from ...repositories import UserRepository
from ...schemas import (
    UserSchema,
    UserRegisterRequest,
    UserSchemaCreate,
    UserUpdate
)

class UserManager(ManagerAbstractBase):
    def __init__(
        self,
        db_session: AsyncSession
    ) -> None:
        self._db_session = db_session
        self.dao = UserRepository[UserSchema](db_session=db_session)
    
    async def fetch_model(
        self, 
        **filters
    ) -> dict:
        await logger.write(f"Fetching user with filter {filters}")

        if response := await self.dao.fetch_model(**filters):  
            return response.model_dump()
        
    async def create_model_from_schema(self, schema: UserRegisterRequest) -> str:
        user_schema = UserSchemaCreate(
            password_hash=Hasher.get_password_hash(schema.password),
            **schema.model_dump()
        )
        return await super().create_model_from_schema(user_schema)

    async def fetch_models(
        self,
        order_by: str = None,
        offset: int = 0,
        **filters
    ) -> list[dict]:
        await logger.write(f"Fetching users with filter {filters}")
        if response := await self.dao.fetch_models(
            order_by=order_by,
            offset=offset,
            limit=25,
            **filters
        ):
            return [obj.model_dump() for obj in response]
        
    async def update_model_from_schema(
        self, 
        user_id: str,
        schema: UserUpdate,
        returning: str | None = None
    ) -> None:
        data = self._formatting_data(schema=schema)
        result = await self.dao.update_model(
            data=data,
            returning=returning,
            id__eq=user_id,
        )
        return result