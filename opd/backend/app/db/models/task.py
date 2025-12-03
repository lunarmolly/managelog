import uuid
from sqlalchemy import String, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Model
from ...schemas import TaskSchema 

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .backlog import BacklogOrm

class TaskOrm(Model):
    __tablename__ = "tasks"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    backlog_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('backlogs.id'), nullable=False)
    done: Mapped[bool] = mapped_column(Boolean(), default=False, nullable=False)
    description: Mapped[str] = mapped_column(String(), nullable=False)
    
    async def to_pydantic(self):
        return TaskSchema(
            task_id=str(self.id),
            backlog_id=str(self.backlog_id),
            done=self.done,
            description=self.description
        )