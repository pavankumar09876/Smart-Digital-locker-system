from fastapi import APIRouter,Depends,HTTPException,status,Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List


from app.schemas.locker import LockerResponse,LockerCreate,LockerUpdate, LockerResponse
from app.core.database import get_db
from app.models.locker import Locker
from app.core.security import require_role
from app.models.auth import Role
from app.models.items import Items


router=APIRouter()

@router.post('/',response_model=LockerResponse)
async def create_locker(locker:LockerCreate, 
                        db:AsyncSession=Depends(get_db),
                        admin=Depends(require_role(Role.admin))):
    new_locker=Locker(location=locker.location, status="AVAILABLE")

    db.add(new_locker)
    await db.commit()
    await db.refresh(new_locker)
    return new_locker


@router.put('/{locker_id}',response_model=LockerResponse)
async def update_locker(
    locker_id:int,
    data:LockerUpdate, 
    db:AsyncSession=Depends(get_db),
    admin=Depends(require_role(Role.admin))
    ):
    result=await db.execute(select(Locker).where(Locker.id==locker_id))
    locker=result.scalar_one_or_none()

    if not locker:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail="Locker Not Found")
    
    if data.location is not None:
        locker.location=data.location
    if data.status is not None:
        locker.status=data.status

    await db.commit()
    await db.refresh(locker)
    return locker

@router.delete('/locker_id')
async def locker_delet(locker_id:int, 
                       db:AsyncSession=Depends(get_db),
                       admin=Depends(require_role(Role.admin))):
    result=await db.execute(select(Locker).where(Locker.id==locker_id))
    locker=result.scalar_one_or_none()

    if not locker:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Locker Not Found")
    
    await db.delete(locker)
    await db.commit()
    return {
        "id": locker_id,
        "detail": "Locker deleted",
       }

@router.delete("/{locker_id}/force-clear")
async def force_clear_locker(
    locker_id: int,
    db: AsyncSession = Depends(get_db),
    admin=Depends(require_role(Role.admin))
):
    # Get locker
    result = await db.execute(
        select(Locker).where(Locker.id == locker_id)
    )
    locker = result.scalar_one_or_none()

    if not locker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Locker not found"
        )

    if locker.status != "OCCUPIED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Locker is not occupied"
        )

    # Get item in locker
    result = await db.execute(
        select(Items).where(
            Items.locker_id == locker_id,
            Items.status == "OCCUPIED"
        )
    )
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found in locker"
        )

    # Force remove item
    item.status = "FORCE_REMOVED"
    item.collected_at = None  # or datetime.utcnow()

    # Free locker
    locker.status = "AVAILABLE"

    await db.commit()

    return {
        "locker_id": locker_id,
        "detail": "Item force-cleared by admin"
    }
