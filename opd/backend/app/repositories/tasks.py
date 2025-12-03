from typing import TypeVar

from ..db.models import TaskOrm
from ..db.orm.dao import DataAccessObject

T = TypeVar("T")

class TasksRepository(DataAccessObject[T]):
    model = TaskOrm
