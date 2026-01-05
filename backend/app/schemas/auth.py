from pydantic import BaseModel,Field,EmailStr
from typing import Optional

class createuser(BaseModel):
    name:str=Field(...,min_length=3, max_length=50)
    email:EmailStr
    password:str=Field(min_length=6)

class userResponse(BaseModel):
    # name:str
    email:EmailStr

    model_config={
        'from_attributes':True
    }

class LoginRequest(BaseModel):
    email:EmailStr
    password:str

class TokenResponse(BaseModel):
    access_token:str
    refresh_token: str
    token_type:str ="bearer"