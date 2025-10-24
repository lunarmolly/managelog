import secrets
from typing import Literal, Optional

import aiohttp

from ..config.settings import settings

class RequestManager:

    @staticmethod
    async def send_request(
        route: str,
        method: Literal["GET", "POST", "PATCH", "DELETE"],
        cookies: dict = None,
        headers: dict = None,
        data: dict = None,
        json: dict = None,
        params: dict = None
    ) -> Optional[dict]:
        """Method for make requests."""
        csrf_token = secrets.token_urlsafe(32)
        if method in ("POST", "PATCH", "DELETE"):
            if cookies:
                cookies.update(
                    {"csrf_token": csrf_token}
                )
            else:
                cookies = {"csrf_token": csrf_token}
            if headers:
                headers.update(
                    {"X-Csrf-token": csrf_token}
                )
            else:
                headers = {"X-Csrf-token": csrf_token}
        url = f"http://{settings.HOST}:{settings.PORT}/api/v1{route}"
        try:
            async with aiohttp.ClientSession(headers=headers) as session:
                async with session.request(method=method, url=url, data=data, json=json, params=params, cookies=cookies) as response:
                    data = {
                        "status_code": response.status,
                        "cookies": response.cookies 
                    }
                    if data["status_code"] != 202:
                        json_data = await response.json()
                        data.update({"data": json_data})
                    return data
        except Exception as e:
            print(e)