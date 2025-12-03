import uuid
from sqlalchemy import String, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Model
from ...schemas import BacklogSchema

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .task import TaskOrm

class BacklogOrm(Model):
    __tablename__ = "backlogs"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(), nullable=False)
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('projects.id'), nullable=False)
    column: Mapped[Integer] = mapped_column(Integer(), nullable=False)
    backlog_number: Mapped[Integer] = mapped_column(Integer(), nullable=False)
    tasks: Mapped[list["TaskOrm"]] = relationship("TaskOrm", uselist=True)
    
    async def to_pydantic(self):
        return BacklogSchema(
            backlog_id=str(self.id),
            name=self.name,
            project_id=str(self.project_id),
            column=self.column,
            backlog_number=self.backlog_number,
            tasks=[await task.to_pydantic() for task in self.tasks] if self.tasks else []
        )