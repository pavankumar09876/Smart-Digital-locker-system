from fastapi import APIRouter,Depends,HTTPException,status,Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID


from app.schemas.locker import AllLockerResponse,LockerCreate,LockerUpdate,LockerCreateResponse
from app.core.database import get_db
from app.models.locker import Locker
from app.core.security import require_role
from app.models.auth import Role
from app.models.items import Items
from app.models.locker_point import LockerPoint

router=APIRouter()


#this function is generate locker name----------
from sqlalchemy import func, select
async def generate_locker_name(
    db: AsyncSession,
    locker_point: LockerPoint
) -> str:
    result = await db.execute(
        select(func.count(Locker.id))
        .where(Locker.locker_point_id == locker_point.id)
    )
    count = result.scalar() or 0

    return f"{locker_point.name}-{count + 1:02d}"
#   -----------------------------------------------


@router.post("/", response_model=LockerCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_locker(
    locker: LockerCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_role(Role.admin))
):
    # 1️⃣ Validate locker point
    locker_point = await db.get(LockerPoint, locker.locker_point)
    if not locker_point:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid locker_point_id"
        )

    # 2️⃣ Generate locker name
    locker_name = await generate_locker_name(db, locker_point)

    # 3️⃣ Create locker
    new_locker = Locker(
        name=locker_name,
        locker_point_id=locker_point.id,
        status="AVAILABLE"
    )

    db.add(new_locker)
    await db.commit()
    await db.refresh(new_locker)

    return new_locker


@router.delete('/{locker_id}')
async def delete_locker(
    locker_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_role(Role.admin))
):
    result = await db.execute(select(Locker).where(Locker.id == locker_id))
    locker = result.scalar_one_or_none()
    if not locker:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Locker not found")

    # Prevent deletion if locker is occupied
    if locker.status == "OCCUPIED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete an occupied locker"
        )

    await db.delete(locker)
    await db.commit()
    return {"message": "Locker deleted successfully"}


@router.put("/{locker_id}/status", response_model=LockerCreateResponse)
async def update_locker_status(
    locker_id: UUID,
    locker_update: LockerUpdate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_role(Role.admin))
):
    # Fetch locker
    result = await db.execute(select(Locker).where(Locker.id == locker_id))
    locker = result.scalar_one_or_none()

    if not locker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Locker not found"
        )

    # Validate status
    if locker_update.status is not None:
        valid_statuses = ["AVAILABLE", "OCCUPIED", "MAINTENANCE"]
        if locker_update.status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )

        # Business logic: prevent setting to OCCUPIED if already occupied
        if locker_update.status == "OCCUPIED" and locker.status == "OCCUPIED":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Locker is already occupied"
            )

        # Business logic: prevent setting to AVAILABLE if occupied by item
        if locker_update.status == "AVAILABLE" and locker.status == "OCCUPIED":
            # Check if there's an active item
            result = await db.execute(
                select(Items).where(
                    Items.locker_id == locker_id,
                    Items.status == "OCCUPIED"
                )
            )
            active_item = result.scalar_one_or_none()
            if active_item:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot set locker to AVAILABLE while it contains an active item. Use force-clear first."
                )

        locker.status = locker_update.status

    await db.commit()
    await db.refresh(locker)

    return locker


@router.delete("/{locker_id}/force-clear")
async def force_clear_locker(
    locker_id: UUID,
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
