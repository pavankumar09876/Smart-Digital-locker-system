from pydantic import BaseModel
from typing import Optional,List
from uuid import UUID

from app.schemas.city import CityResponse


class StateCreate(BaseModel):
    name: str


class StateUpdate(BaseModel):
    name: Optional[str] = None


class StateResponse(BaseModel):
    id: UUID
    name: str
    cities: List[CityResponse] = []

    model_config = {
        "from_attributes": True
    }
