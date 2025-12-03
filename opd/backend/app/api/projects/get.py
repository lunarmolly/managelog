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
    ProjectGetResponse
)
from ...user.secuiry import UserOAuth

from .projects import projects_router

import logging

@projects_router.get(
    "/get/",
    responses={
        200: {"model": ProjectGetResponse}
    }
)
async def create(
    request: Request,
    db_session: AsyncSession = Depends(get_db),
) -> Optional[ProjectGetResponse]: 
    await logger.write(
        f"{request.method} Request from {request.client.host}: {request.client.port} Handler /projects/get/"
    )
    user = await UserOAuth.authenticate(request=request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized"
        )
    connector = Administrator(db_session)
    async with connector.start() as administrator:
        projects = await administrator.projects.fetch_models(
            user_id__eq=user['user_id']
        )
        return ORJSONResponse(
            content=ProjectGetResponse(projects=projects if projects else []).model_dump()
        )
    return ORJSONResponse(
        status_code=400,
        content="Unknown error"
    )
