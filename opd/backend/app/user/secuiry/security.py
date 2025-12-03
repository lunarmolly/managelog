from fastapi import Request

from ...schemas import TokenData
from typing import Any

from fastapi import Request, HTTPException
from fastapi.security import OAuth2PasswordBearer

from ..db import get_db
from ...dependencies.auth.authorization import AuthorizationService
from ...dependencies.auth.authentification import authentificate_user
from ...schemas import TokenData

oauth2_scheme_access = OAuth2PasswordBearer(tokenUrl="token")

class UserOAuth:

    @staticmethod
    async def authentication_process_user(
         access_token: str,
         refresh_token: str,
         request: Request
    ):
        tokens = TokenData(
            access_token=access_token, 
            refresh_token=refresh_token
        )
        async with get_db() as session:
            try:
                user = await authentificate_user(tokens=tokens, session=session)
                if user:
                    return user
            except HTTPException as e:
                if e.status_code == 401:
                    pass
                else:
                    return False
            try:
                refreshed_tokens: TokenData = AuthorizationService.refresh_tokens(refresh_token=refresh_token)
                request.cookies.update({
                    'access_token': refreshed_tokens.access_token,
                    'refresh_token': refreshed_tokens.refresh_token,
                })
                new_tokens = TokenData(
                    access_token=refreshed_tokens.access_token,
                    refresh_token=refreshed_tokens.refresh_token
                )
                user = await authentificate_user(tokens=new_tokens, session=session)
                if user:
                    return user
            except Exception as e:
                print(f"Failed to refresh tokens: {e}")
        return False

     
    @classmethod
    async def authenticate(cls, request: Request) -> Any:
        access_token = request.cookies.get('access_token')
        refresh_token = request.cookies.get('refresh_token')
        if (access_token and refresh_token):
            if response := await cls.authentication_process_user(access_token, refresh_token, request):
                return response
        return False