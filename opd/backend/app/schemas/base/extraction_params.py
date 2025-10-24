from fastapi import Query
from pydantic import BaseModel

class ExtractionParamsBase(BaseModel):
    offset: int = Query(
        default=0,
        description="Param for skip some entries. Always greater than 0. 0 by default",
        ge=0,
    )
    