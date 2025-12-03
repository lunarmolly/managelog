import typing as tp

from sqlalchemy.ext.asyncio import AsyncSession

from .administrator import Administrator
from ..schemas import UserSchema, AdminSchema

async def get_profile(
    filter_: str,
    role: tp.Literal["admin", "user"],
    session: AsyncSession
) -> tp.Union[UserSchema, AdminSchema]:
    connector = Administrator(session)
    async with connector.start() as administrator:
        match role:
            case "user":
                if response := await administrator.users.fetch_model(login__eq=filter_):
                    return response
                elif response := await administrator.users.fetch_model(email__eq=filter_):
                    return response
                else: 
                    return None
            case "admin":
                return await administrator.admin.fetch_model(login__eq=filter_)
            case _:
                return None
