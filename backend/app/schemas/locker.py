from pydantic import BaseModel
from typing import Optional

class LockerCreate(BaseModel):
    location:str
    

class LockerUpdate(BaseModel):
    location: Optional[str]=None
    status: Optional[str]=None


class LockerResponse(BaseModel):
    id:int
    location:str
    status:str

    model_config={
        'from_attributes':True
    }

from pydantic import BaseModel

class LockerResponse(BaseModel):
    id: int
    location: str
    status: str

    model_config = {
        "from_attributes": True
    }
