from typing import Optional
from pydantic import BaseModel

from .backlog import BacklogSchema

class ProjectSchema(BaseModel):
    project_id: str
    user_id: str
    name: str
    backlogs: list[BacklogSchema]

class ProjectSchemaUpdateRequest(BaseModel):
    project_id: str
    name: Optional[str] = None

class ProjectSchemaUpdate(BaseModel):
    name: Optional[str] = None

class ProjectSchemaCreate(BaseModel):
    user_id: str
    name: str
    backlogs: list[BacklogSchema]

class ProjectSchemaCreateRequest(BaseModel):
    name: str

class ProjectSchemaDeleteRequest(BaseModel):
    project_id: str

class ProjectGetResponse(BaseModel):
    projects: list[ProjectSchema]
