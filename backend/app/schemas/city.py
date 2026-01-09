from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from app.schemas.locker_point import LockerPointResponse


class CityCreate(BaseModel):
    name: str
    state_id: UUID


class CityUpdate(BaseModel):
    name: Optional[str] = None
    state_id: Optional[UUID] = None

class CityCreateResponse(BaseModel):
    id: UUID
    name: str
    state_id: UUID

    model_config = {
        "from_attributes": True
    }

class CityResponse(BaseModel):
    id: UUID
    name: str
    locker_points: list[LockerPointResponse]

    model_config = {
        "from_attributes": True
    }
