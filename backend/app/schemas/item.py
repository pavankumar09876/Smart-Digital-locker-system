from pydantic import BaseModel,EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID

#  INPUT SCHEMA FOR CREATING AN ITEM
class ItemCreate(BaseModel):
    name:str
    locker_id:UUID
    your_email:str
    receiver_phone_number:str
    receiver_emailid:EmailStr
    description:Optional[str]=None
    


class ItemCollect(BaseModel):
    otp:str

class ItemCollectResponse(BaseModel):
    item_id: int
    detail: str


class ItemOTPRequest(BaseModel):
    contact: str

    model_config={
        'from_attributes':True
    }


#   OUTPUT SCHEMA FOR RESPONSE
class ItemResponse(BaseModel):
    id: int
    name: Optional[str]
    description: Optional[str]
    locker_id: UUID
    your_email:str
    receiver_phone: str
    receiver_email: EmailStr
    status: str
    created_at: datetime

    model_config={
        'from_attributes':True
    }
