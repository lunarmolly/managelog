from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession

from ..utils.handlers.error import error_handler
from ..utils.logger import logger
from .managers import (
    UserManager, 
    AdminManager,
    ProjectsManager,
    BacklogsManager,
    TasksManager
)

import logging

class Administrator:
    """Class for orchestrating managers"""
    def __init__(
        self,
        db_session: AsyncSession
    ) -> None:
        self._db_session = db_session
    
    @asynccontextmanager
    async def start(self):
        try:
            yield self
            await self._db_session.commit()
        except Exception as e:
            logging.error(e)
            await self._db_session.rollback()
            await logger.write("DB operations rolled back")
            # await error_handler.handle(e)
        finally:
            await self._db_session.close()
        
    @property    
    def users(self) -> UserManager:
        return UserManager(self._db_session)

    @property    
    def admin(self) -> AdminManager:
        return AdminManager(self._db_session)
    
    @property
    def projects(self) -> ProjectsManager:
        return ProjectsManager(self._db_session)
    
    @property
    def backlogs(self) -> BacklogsManager:
        return BacklogsManager(self._db_session)
    
    @property
    def tasks(self) -> TasksManager:
        return TasksManager(self._db_session)