import json
import datetime
from functools import wraps
from typing import Any, Awaitable, Callable

from pydantic import BaseModel
from redis.asyncio.client import Redis

from .logger import logger
from .redis import redis_connection

class Cache:

    @classmethod
    def cache_layer(cls, func):

        @wraps(func)
        async def inner(*args, **kwargs):
            await logger.write("Checking data in cache...")
            redis: Redis = await redis_connection.get_redis_connection()
            if obj_id := kwargs.get("filter_"):
                return await cls._fetch_obj(
                    redis=redis, 
                    func=func, 
                    args=args, 
                    kwargs=kwargs, 
                    obj_id=obj_id
                )
            elif objs_type := kwargs.get("objs_type"):
                return await cls._fetch_objs(
                    redis=redis, 
                    func=func, 
                    objs_type=objs_type,
                    args=args,
                    kwargs=kwargs
                )

        return inner

    @staticmethod
    async def _fetch_obj(
        redis: Redis,
        func: Callable[..., Awaitable[BaseModel]],
        args: tuple,
        kwargs: dict,
        obj_id: str
    ) -> dict: 
        if response := await redis.get(str(obj_id)):
            return json.loads(response)
        if obj := await func(*args, **kwargs):
            await redis.setex(
                name=str(obj_id),
                value=json.dumps(obj),
                time=datetime.timedelta(minutes=10),
            )
            return obj
        
    @staticmethod
    async def _fetch_objs(
        redis: Redis,
        func: Callable[..., Awaitable[Any]],
        objs_type: str,
        args: tuple,
        kwargs: dict
    ) -> list:
        if response := await redis.get(objs_type):
            return json.loads(response)
        if objs := await func(*args, **kwargs):
            await redis.setex(
                name=objs_type,
                value=json.dumps(objs),
                time=datetime.timedelta(minutes=10),
            )
            return objs
     
    @staticmethod   
    async def remove_obj(
        redis: Redis,
        **kwargs
    ):
        await logger.write("Deleting data from cache...")
        if obj_id := kwargs.get("obj_id"):
            await redis.delete(f"{obj_id}")
        if objs_type := kwargs.get("obj_id"):
            await redis.delete(f"{objs_type}")