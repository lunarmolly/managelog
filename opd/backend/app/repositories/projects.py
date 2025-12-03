from typing import TypeVar

from ..db.models import ProjectOrm
from ..db.orm.dao import DataAccessObject

T = TypeVar("T")

class ProjectsRepository(DataAccessObject[T]):
    model = ProjectOrm
