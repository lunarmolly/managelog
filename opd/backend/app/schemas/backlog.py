from pydantic import BaseModel

from typing import Optional

from .task import TaskSchema

class BacklogSchema(BaseModel):
    backlog_id: str
    project_id: str
    name: str
    column: int
    backlog_number: int
    tasks: list[TaskSchema] = []

class BacklogSchemaCreate(BaseModel):
    project_id: str
    name: str
    column: int
    backlog_number: int
    tasks: list[TaskSchema] = []

class BacklogSchemaCreateRequest(BaseModel):
    project_id: str
    name: str
    column: int
    backlog_number: int

class BacklogUpdate(BaseModel):
    name: Optional[str] = None
    column: Optional[int] = None
    backlog_number: Optional[int] = None

class BacklogSchemaUpdateRequest(BaseModel):
    backlog_id: str
    name: str = None
    column: int = None
    backlog_number: int = None

class BacklogDeleteRequest(BaseModel):
    backlog_id: str