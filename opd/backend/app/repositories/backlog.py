from typing import TypeVar

from ..db.models import BacklogOrm
from ..db.orm.dao import DataAccessObject

T = TypeVar("T")

class BacklogRepository(DataAccessObject[T]):
    model = BacklogOrm
