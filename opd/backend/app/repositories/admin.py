from typing import Any, TypeVar

from ..db.models import AdminOrm
from ..db.orm.dao import DataAccessObject

T = TypeVar("T")

class AdminRepository(DataAccessObject[T]):
    model = AdminOrm
    
    async def insert_models(self, data: list[dict]):
        raise NotImplementedError("Insert models method is not applicable for AdminRepository.")
    
    async def update_models(self, cases: tuple[str, tuple[str, str, Any]], **filters):
        raise NotImplementedError("Update models method is not applicable for AdminRepository.")
    
    async def update_model(self, filter_: tuple, data: dict[str, dict]):
        raise NotImplementedError("Update model method is not applicable for AdminRepository.")