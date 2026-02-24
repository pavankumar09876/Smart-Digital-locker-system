from fastapi import APIRouter,status,Depends,HTTPException
from jose import JWTError,jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.security import OAuth2PasswordRequestForm
from typing import List

from app.schemas.auth import createuser,userResponse,TokenResponse,LoginRequest
from app.core.database import get_db
from app.models.auth import User
from app.core.hashing import Hash
from app.core import token
from app.core.config import settings
from app.core.security import get_current_user



router=APIRouter()


@router.post('/refresh')
async def refresh_token(refresh_token:str):
    try:
        payload=jwt.decode(refresh_token, settings.REFRESH_SECRET_KEY,algorithms=[settings.ALGORITHM])
        user_id=payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
                )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid token"
            )
    access_token=token.create_access_token(
        {"sub":user_id}
    )
    return {
        "access token":access_token, 
        "token type":"bearer"
        }

@router.post('/signup',status_code=status.HTTP_200_OK)
async def signup(data:createuser,db:AsyncSession=Depends(get_db)):
    result= await db.execute(
        select(User).where(User.email==data.email)
        )
    
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already Registered"
            )
    user=User(
        name=data.name,
        email=data.email,
        password=Hash.hashed_password(data.password)
        )
    db.add(user)
    await db.commit()
    return {"message": "User created successfully"}


@router.post('/login',response_model=TokenResponse)
async def login(data:LoginRequest, 
                db:AsyncSession=Depends(get_db)):
    result=await db.execute(
        select(User).where(User.email==data.email)
        )
    user=result.scalar_one_or_none()

    if not user or not Hash.verify_password(
        data.password, 
        user.password
        ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials"
            )
    access_token=token.create_access_token(
        {
            "sub":str(user.id), 
            "role":user.role.value
        }
    )
    refresh_token=token.create_refresh_token(
        {
            "sub":str(user.id)
        }
    )
    return {
        "access_token":access_token,
        "refresh_token":refresh_token,
        "token_type":"bearer"
    }


@router.get('/',response_model=List[userResponse])
async def get_users(db:AsyncSession=Depends(get_db)):
    result=await db.execute(select(User))
    user=result.scalars().all()
    return user

@router.get("/me", response_model=userResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user