from typing import Optional, Annotated

from fastapi import Depends, Request, Path, status, HTTPException
from fastapi.routing import APIRouter
from fastapi.responses import ORJSONResponse, Response
from sqlalchemy.ext.asyncio import AsyncSession

from ...dependencies.administrator import Administrator
from ...utils.hasher import Hasher
from ...utils.logger import logger
from ...dependencies.db import get_db
from ...dependencies.auth import AuthorizationService
from ...schemas import (
    ProjectSchema, ProjectSchemaDeleteRequest, UserUpdate
)
from ...user.secuiry import UserOAuth

from .projects import projects_router

import logging

@projects_router.delete(
    "/delete/",
    responses={
        200: {"model": ProjectSchema}
    }
)
async def delete(
    request: Request,
    body: ProjectSchemaDeleteRequest,
    db_session: AsyncSession = Depends(get_db),
) -> Optional[ProjectSchema]: 
    await logger.write(
        f"{request.method} Request from {request.client.host}: {request.client.port} Handler /projects/delete/"
    )
    user = await UserOAuth.authenticate(request=request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized"
        )
    connector = Administrator(db_session)
    async with connector.start() as administrator:
        await administrator.projects.delete_model(
            id__eq=body.project_id
        )
        user['projects_ids'].remove(body.project_id)
        await administrator.users.update_model_from_schema(
            user_id=user['user_id'],
            schema=UserUpdate(projects_ids=user['projects_ids'])
        )
        return ORJSONResponse(
            content={'project_id': body.project_id}
        )
    return ORJSONResponse(
        status_code=400,
        content="Unknown error"
    )
