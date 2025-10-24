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
    UserLoginRequest, UserLoginResponse, TokenData
)

from .auth import auth_router

@auth_router.post(
    "/login/",
    responses={
        200: {"model": UserLoginResponse}
    }
)
async def login(
    request: Request,
    body: UserLoginRequest,
    db_session: AsyncSession = Depends(get_db),
) -> Optional[UserLoginResponse]: 
    await logger.write(
        f"{request.method} Request from {request.client.host}: {request.client.port} Handler /auth/login/"
    )
    if (not body.email) and (not body.login):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST
        )
    if tokens := await AuthorizationService.login(
        body.__dict__, 
        role='user', 
        session=db_session
    ):
        return ORJSONResponse(
            status_code=200,
            content={'status': "ok"},
            headers={
                'Set-Cookie': f"access_token={tokens.access_token};refresh_token={tokens.refresh_token}",
            }
        )
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Can`t procces the request"
    )
