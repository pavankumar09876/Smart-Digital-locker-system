from pydantic import BaseModel
from typing import Optional
from uuid import UUID
# from app.schemas.locker import LockerResponse


class LockerCreate(BaseModel):
    locker_point: UUID   # locker_point_id



class LockerUpdate(BaseModel):
    status: Optional[str] = None



class AllLockerResponse(BaseModel):
    id: UUID
    name: str
    status: str
    locker_point_name: str

    model_config = {
        "from_attributes": True
    }

class LockerCreateResponse(BaseModel):
    id: UUID
    name: str
    status: str
    locker_point_id: UUID

    model_config = {
        "from_attributes": True
    }


class LockerMiniResponse(BaseModel):
    id: UUID
    status: str

    model_config = {
        "from_attributes": True
    }
