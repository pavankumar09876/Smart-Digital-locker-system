from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List,Optional
from uuid import UUID
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.locker_point import LockerPoint
from app.core.security import require_role
from app.models.auth import Role
from app.schemas.locker_point import (
    LockerPointCreate, 
    LockerPointResponse,
    LockerPointUpdate,
    LockerPointUpdateResponse
    )

from app.models.city import City


router = APIRouter()

@router.get("/", response_model=list[LockerPointResponse])
async def get_locker_points(
    city_id: Optional[UUID] = Query(None, description="Filter by city_id"),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(LockerPoint)
        .options(selectinload(LockerPoint.lockers))
    )
    if city_id:
        query = query.where(LockerPoint.city_id == city_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.post(
    "/",
    response_model=LockerPointResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_locker_point(
    locker_point: LockerPointCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_role(Role.admin))
):
    # 1️⃣ Validate city exists
    city = await db.get(City, locker_point.city_id)
    if not city:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid city_id: City does not exist"
        )

    # 2️⃣ Prevent duplicate locker point in same city
    result = await db.execute(
        select(LockerPoint).where(
            LockerPoint.city_id == locker_point.city_id,
            LockerPoint.name == locker_point.name.strip()
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Locker point already exists in this city"
        )

    # 3️⃣ Create locker point
    new_locker_point = LockerPoint(
        name=locker_point.name.strip(),
        address=locker_point.address,
        city_id=locker_point.city_id
    )

    db.add(new_locker_point)
    await db.commit()
    await db.refresh(new_locker_point)

    return new_locker_point


@router.get('/{locker_point_id}', response_model=LockerPointResponse)
async def get_locker_point(locker_point_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(LockerPoint)
        .options(selectinload(LockerPoint.lockers))
        .where(LockerPoint.id == locker_point_id)
    )
    locker_point = result.scalar_one_or_none()
    if not locker_point:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Locker point not found")
    return locker_point

@router.put(
    "/{locker_point_id}",
    response_model=LockerPointUpdateResponse
)
async def update_locker_point(
    locker_point_id: UUID,                         
    locker_point_update: LockerPointUpdate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_role(Role.admin))
):
    locker_point = await db.get(LockerPoint, locker_point_id)

    if not locker_point:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Locker point not found"
        )

    update_data = locker_point_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(locker_point, key, value)

    await db.commit()
    await db.refresh(locker_point)

    return locker_point

@router.delete('/{locker_point_id}')
async def delete_locker_point(
    locker_point_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_role(Role.admin))
):
    result = await db.execute(select(LockerPoint).where(LockerPoint.id == locker_point_id))
    locker_point = result.scalar_one_or_none()
    if not locker_point:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Locker point not found")
    
    await db.delete(locker_point)
    await db.commit()
    return {"message": "Locker point deleted successfully"}
