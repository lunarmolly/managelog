import uuid
from sqlalchemy import String, Float, Integer, ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Model
from ...schemas import UserSchema

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .projeсt import ProjectOrm

class UserOrm(Model):
    __tablename__ = "users"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    login: Mapped[str] = mapped_column(String(), nullable=False)
    email: Mapped[str] = mapped_column(String(), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(), nullable=False)
    name: Mapped[str] = mapped_column(String(), nullable=False)
    last_name: Mapped[str] = mapped_column(String(), nullable=False)
    company_name: Mapped[str] = mapped_column(String(), nullable=False)
    earnings: Mapped[float] = mapped_column(Float(), nullable=False, default=.0)
    projects_ids: Mapped[list[uuid.UUID]] = mapped_column(ARRAY(UUID), default=list)
    
    async def to_pydantic(self):
        return UserSchema(
            user_id=str(self.id),
            projects_ids=[str(i) for i in self.projects_ids],
            **{k: v for k, v in self.__dict__.items() if not k.startswith('_') and k != 'projects_ids'}
        )