import uuid
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Model
from ...schemas import ProjectSchema 

from typing import TYPE_CHECKING

from ...utils.logger import logger

if TYPE_CHECKING:
    from .backlog import BacklogOrm

class ProjectOrm(Model):
    __tablename__ = "projects"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.id'), nullable=False)
    name: Mapped[str] = mapped_column(String(), nullable=False)
    backlogs: Mapped[list["BacklogOrm"]] = relationship("BacklogOrm", uselist=True)
    
    async def to_pydantic(self):
        return ProjectSchema(
            project_id=str(self.id),
            user_id=str(self.user_id),
            name=self.name,
            backlogs=[await backlog.to_pydantic() for backlog in self.backlogs] if self.backlogs else []
        )