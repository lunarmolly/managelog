import uuid

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from .base import Model
from ...schemas import UserSchema

class UserOrm(Model):
    __tablename__ = "users"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    login: Mapped[str] = mapped_column(String(), nullable=False)
    email: Mapped[str] = mapped_column(String(), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(), nullable=False)

    def to_pydantic(self) -> UserSchema:
        return UserSchema(
            user_id=str(self.id),
            login=self.login,
            email=self.email,
            password_hash=self.password_hash
        )