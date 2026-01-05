from fastapi import APIRouter,Depends,HTTPException,status,Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List


from app.schemas.locker import LockerResponse,LockerCreate,LockerUpdate, LockerResponse
from app.core.database import get_db
from app.models.locker import Locker
from app.core.security import require_role
from app.models.auth import Role


router=APIRouter()


@router.get('/',response_model=List[LockerResponse])
async def get_lockers(db:AsyncSession=Depends(get_db)):
    result=await db.execute(select(Locker))
    locker=result.scalars().all()
    return locker

@router.get('/by-place', response_model=List[LockerResponse])
async def get_lockers_by_place(
    location: str=Query(..., description="Locker place"),
    db: AsyncSession=Depends(get_db)
):
    result=await db.execute(
        select(Locker).where(
            Locker.location == location,
            Locker.status=="AVAILABLE"
        )
    )
    lockers = result.scalars().all()
    return lockers

@router.get('/{locker_id}',response_model=LockerResponse)
async def get_locker(locker_id:int, db:AsyncSession=Depends(get_db)):
    result= await db.execute(select(Locker).where(Locker.id==locker_id))
    locker=result.scalar_one_or_none()
    if not locker:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail="Locker not found")
    return locker

