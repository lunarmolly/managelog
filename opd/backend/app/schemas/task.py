from pydantic import BaseModel

from typing import Optional

class TaskSchema(BaseModel):
    task_id: str
    backlog_id: str
    done: bool
    description: str

class TaskSchemaCreate(BaseModel):
    backlog_id: str
    done: bool = False
    description: str

class TaskSchemaCreateRequest(BaseModel):
    backlog_id: str
    description: str

class TaskUpdate(BaseModel):
    description: Optional[str] = None
    done: Optional[bool] = None

class TaskUpdateRequest(BaseModel):
    task_id: str
    description: Optional[str] = None
    done: Optional[bool] = None

class TaskDeleteRequest(BaseModel):
    task_id: str