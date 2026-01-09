from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from app.schemas.locker import LockerMiniResponse


class LockerPointCreate(BaseModel):
    name: str                           # e.g. "GDV-bus_stand"
    address: Optional[str] = None
    city_id: UUID



class LockerPointResponse(BaseModel):
    id: UUID
    name: str
    address: Optional[str]
    city_id: UUID
    lockers: list[LockerMiniResponse]

    model_config = {
        "from_attributes": True
    }


class LockerPointUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None

class LockerPointUpdateResponse(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None