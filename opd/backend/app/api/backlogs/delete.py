from typing import Optional

from fastapi import Depends, Request, Path, status, HTTPException
from fastapi.responses import ORJSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from ...dependencies.administrator import Administrator
from ...utils.logger import logger
from ...dependencies.db import get_db
from ...schemas import (
    BacklogSchema, BacklogDeleteRequest
)
from ...user.secuiry import UserOAuth

from .backlog import backlogs_router

import logging

@backlogs_router.delete(
    "/delete/",
    responses={
        200: {"model": dict[str, str]}
    }
)
async def delete(
    request: Request,
    body: BacklogDeleteRequest,
    db_session: AsyncSession = Depends(get_db),
) -> Optional[BacklogSchema]: 
    await logger.write(
        f"{request.method} Request from {request.client.host}: {request.client.port} Handler /backlogs/delete/"
    )
    user = await UserOAuth.authenticate(request=request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized"
        )
    connector = Administrator(db_session)
    async with connector.start() as administrator:
        backlog_id = await administrator.backlogs.delete_model(
            id__eq=body.backlog_id
        )
        return ORJSONResponse(
            content={'backlog_id': body.backlog_id}
        )
    return ORJSONResponse(
        status_code=400,
        content="Unknown error"
    )
