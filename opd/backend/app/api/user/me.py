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
    UserLoginRequest, UserLoginResponse, TokenData, UserSchema, UserMeResponse
)
from ...user.secuiry import UserOAuth

from .user import user_router

@user_router.get(
    "/me/",
    responses={
        200: {"model": UserMeResponse}
    }
)
async def me(
    request: Request,
) -> Optional[UserMeResponse]: 
    await logger.write(
        f"{request.method} Request from {request.client.host}: {request.client.port} Handler /user/me/"
    )
    if user := await UserOAuth.authenticate(request=request):
        return ORJSONResponse(
            status_code=200,
            content=UserMeResponse(**user).model_dump()
        )
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorized"
    )
