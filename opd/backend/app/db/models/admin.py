import datetime
import uuid

from sqlalchemy.orm import Mapped, mapped_column

from .base import Model
from ...schemas import AdminSchema

class AdminOrm(Model):
    __tablename__ = "admins"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    login: Mapped[str] = mapped_column(nullable=False, unique=True)
    hash_password: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime.date] = mapped_column(default=datetime.date.today)

    async def to_pydantic(self) -> AdminSchema:
        return AdminSchema(
            admin_id=str(self.id),
            login=self.login,
            hash_password=self.hash_password,
            created_at=self.created_at.isoformat(),
        )