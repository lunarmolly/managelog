from typing import Optional, Annotated

from fastapi import Depends, Request, Path, status, HTTPException
from fastapi.routing import APIRouter
from fastapi.responses import ORJSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import NoResultFound

from ...dependencies.administrator import Administrator
from ...utils.logger import logger
from ...dependencies.db import get_db
from ...schemas import (
    UserRegisterRequest,
    UserRegisterResponse
)

from .auth import auth_router

@auth_router.post(
    "/register/",
    responses={
        200: {"model": UserRegisterResponse}
    }
)
async def register(
    request: Request,
    body: UserRegisterRequest,
    db_session: AsyncSession = Depends(get_db),
) -> Optional[UserRegisterResponse]: 
    await logger.write(
        f"{request.method} Request from {request.client.host}: {request.client.port} Handler /auth/register/"
    )
    if not body.email or not body.login:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST
        )
    connector = Administrator(db_session)
    async with connector.start() as administrator:
        if await administrator.users.fetch_models(email__eq=body.email) or await administrator.users.fetch_models(login__eq=body.login):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT
            )
        await administrator.users.create_model_from_schema(body)
        return ORJSONResponse(
            content={'status': 'ok'}
        )
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Can`t procces the request"
    )
