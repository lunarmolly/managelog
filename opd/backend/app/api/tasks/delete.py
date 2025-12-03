from typing import Optional

from fastapi import Depends, Request, Path, status, HTTPException
from fastapi.responses import ORJSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from ...dependencies.administrator import Administrator
from ...utils.logger import logger
from ...dependencies.db import get_db
from ...schemas import (
    TaskSchema, TaskDeleteRequest
)
from ...user.secuiry import UserOAuth

from .tasks import tasks_router

import logging

@tasks_router.delete(
    "/delete/",
    responses={
        200: {"model": dict[str, str]}
    }
)
async def delete(
    request: Request,
    body: TaskDeleteRequest,
    db_session: AsyncSession = Depends(get_db),
) -> Optional[TaskSchema]: 
    await logger.write(
        f"{request.method} Request from {request.client.host}: {request.client.port} Handler /tasks/delete/"
    )
    user = await UserOAuth.authenticate(request=request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized"
        )
    connector = Administrator(db_session)
    async with connector.start() as administrator:
        task_id = await administrator.tasks.delete_model(
            id__eq=body.task_id
        )
        return ORJSONResponse(
            content={'task_id': body.task_id}
        )
    return ORJSONResponse(
        status_code=400,
        content="Unknown error"
    )
