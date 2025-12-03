from typing import Optional

from fastapi import  Request, status, Response
from fastapi.responses import ORJSONResponse

from ...utils.logger import logger

from .auth import auth_router

@auth_router.post(
    "/logout/",
    response_model=None
)
async def logout(
    request: Request,
) -> Optional[Response]: 
    await logger.write(
        f"{request.method} Request from {request.client.host}: {request.client.port} Handler /auth/logout/"
    )
    request.session.clear()
    return ORJSONResponse(
        status_code=status.HTTP_200_OK,
        content={'status': 'ok'}
    )
