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
    TaskSchema, TaskUpdateRequest, TaskUpdate
)
from ...user.secuiry import UserOAuth

from .tasks import tasks_router

import logging

@tasks_router.put(
    "/update/",
    responses={
        200: {"model": dict[str, str]}
    }
)
async def update(
    request: Request,
    body: TaskUpdateRequest,
    db_session: AsyncSession = Depends(get_db),
) -> Optional[TaskSchema]: 
    await logger.write(
        f"{request.method} Request from {request.client.host}: {request.client.port} Handler /tasks/update/"
    )
    user = await UserOAuth.authenticate(request=request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized"
        )
    connector = Administrator(db_session)
    async with connector.start() as administrator:
        await administrator.tasks.update_model_from_schema(
            schema=TaskUpdate(**body.model_dump()), 
            task_id=body.task_id
        )
        return ORJSONResponse(
            content={'task_id': body.task_id}
        )
    return ORJSONResponse(
        status_code=400,
        content="Unknown error"
    )
