from typing import Literal, Optional
from datetime import datetime, timedelta, UTC

from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession

from ..administrator import Administrator
from ...config.settings import settings
from ...utils.hasher import Hasher
from ...schemas import TokenData

import logging

class AuthorizationService: 
    
    @classmethod
    async def login(cls, data: str | dict, role: Literal["user", "admin"], session: AsyncSession) -> TokenData | None:
        if role == "admin":
            return await cls._procces_authorization_admin(data=data, session=session)
        return await cls._procces_authorization_user(data=data, session=session)

    @classmethod
    async def _procces_authorization_user(cls, data: dict, session: AsyncSession):
        connector = Administrator(session)
        async with connector.start() as administrator: 
            filters = {}
            if data['email']: filters['email__eq'] = data['email']
            elif data['login']: filters['login__eq'] = data['login']
            user = await administrator.users.fetch_model(**filters)
            if Hasher.verify_password(data["password"], user['password_hash']): 
                access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
                refresh_token_expires = timedelta(hours=settings.REFRESH_TOKEN_EXPIRE_HOURS)
                access_token = cls.create_access_token( 
                    data={ 
                        "sub": user['login'], 
                        "scopes": ["user"]
                    },
                    expires_delta=access_token_expires
                )
                refresh_token = cls.create_refresh_token(
                    data={ 
                        "sub": user['login'], 
                        "scopes": ["user"]
                    },
                    expires_delta=refresh_token_expires
                )
                return TokenData(
                    access_token=access_token,
                    refresh_token=refresh_token
                )

    @classmethod
    async def _procces_authorization_admin(cls, data: dict, session: AsyncSession): 
        connector = Administrator(session)
        async with connector.start() as administrator: 
            admin = await administrator.admin.fetch_model(login__eq=data["login"])
            if Hasher.verify_password(data["password"], admin.hash_password): 
                access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
                refresh_token_expires = timedelta(hours=settings.REFRESH_TOKEN_EXPIRE_HOURS)
                access_token = cls.create_access_token( 
                    data={ 
                        "sub": admin.login, 
                        "scopes": ["admin"]
                    },
                    expires_delta=access_token_expires
                )
                refresh_token = cls.create_refresh_token(
                    data={ 
                        "sub": admin.login, 
                        "scopes": ["admin"]
                    },
                    expires_delta=refresh_token_expires
                )
                return TokenData(
                    access_token=access_token,
                    refresh_token=refresh_token
                )

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        expire = datetime.now(UTC) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        expire = datetime.now(UTC) + (expires_delta or timedelta(hours=settings.REFRESH_TOKEN_EXPIRE_HOURS))
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt
    
    @classmethod
    def refresh_tokens(cls, refresh_token: str):
        print("refresh_tokens ENTRY")
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        print("jwt.decode PASSED")
        new_access_token = cls.create_access_token(data={"sub": payload["sub"], "scopes": payload["scopes"]})
        new_refresh_token = cls.create_refresh_token(data={"sub": payload["sub"], "scopes": payload["scopes"]})
        print(f"NEW TOKEN\n{new_access_token}\n{new_refresh_token}")
        token_Data = TokenData(
            access_token=new_access_token, 
            refresh_token=new_refresh_token
        )
        return token_Data
