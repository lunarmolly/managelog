from typing import Optional

from fastapi import Depends, Request, Path, status, HTTPException
from fastapi.responses import ORJSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from ...dependencies.administrator import Administrator
from ...utils.logger import logger
from ...dependencies.db import get_db
from ...schemas import (
    BacklogSchema, BacklogSchemaUpdateRequest, BacklogUpdate
)
from ...user.secuiry import UserOAuth

from .backlog import backlogs_router

import logging

@backlogs_router.put(
    "/update/",
    responses={
        200: {"model": dict[str, str]}
    }
)
async def update(
    request: Request,
    body: BacklogSchemaUpdateRequest,
    db_session: AsyncSession = Depends(get_db),
) -> Optional[BacklogSchema]: 
    await logger.write(
        f"{request.method} Request from {request.client.host}: {request.client.port} Handler /backlogs/create/"
    )
    user = await UserOAuth.authenticate(request=request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized"
        )
    connector = Administrator(db_session)
    async with connector.start() as administrator:
        backlog_id = await administrator.backlogs.update_model_from_schema(
            backlog_id=body.backlog_id,
            schema=BacklogUpdate(**body.__dict__)
        )
        return ORJSONResponse(
            content={'backlog_id': body.backlog_id}
        )
    return ORJSONResponse(
        status_code=400,
        content="Unknown error"
    )
