# from typing import Optional, Annotated

# from fastapi import Depends, Request, Path, status, HTTPException
# from fastapi.routing import APIRouter
# from fastapi.responses import ORJSONResponse
# from sqlalchemy.ext.asyncio import AsyncSession

# from ..dependencies.administrator import Administrator
# from ..utils.logger import logger
# from ..dependencies.db import get_db
# from ..schemas import (
#     UserGetResponse, UserUpdate
# )

# import logging

# users_router = APIRouter(prefix="/users", tags=["Users"]) 

# @users_router.get(
#     "/{telegram_id}/",
#     responses={
#         200: {"model": UserGetResponse}
#     }
# )
# async def get_user(
#     request: Request,
#     telegram_id: Annotated[int, Path()],
#     db_session: AsyncSession = Depends(get_db),
# ) -> Optional[UserGetResponse]: 
#     await logger.write(
#         f"{request.method} Request from {request.client.host}: {request.client.port} Handler /users/{telegram_id}/"
#     )
#     # connector = Administrator(db_session)
#     # async with connector.start() as administrator:
#     #     user = await administrator.users.fetch_model(filter_=telegram_id)

#     #     return ORJSONResponse(
#     #         status_code=status.HTTP_200_OK, 
#     #         content={"user": user}
#         # )s
#     # raise HTTPException(
#     #     status_code=status.HTTP_400_BAD_REQUEST,
#     #     detail="Can`t procces the request"
#     # )
#     return ORJSONResponse(
#         content={"user_id": telegram_id},
#         status_code=status.HTTP_200_OK
#     )