from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List,Optional
from uuid import UUID

from app.schemas.locker import AllLockerResponse, LockerCreate, LockerUpdate,LockerCreateResponse
from app.core.database import get_db
from app.models.locker import Locker
from app.core.security import require_role
from app.models.auth import Role
from app.models.locker_point import LockerPoint
from app.models.city import City
from app.models.state import State
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=list[AllLockerResponse])
async def get_lockers(
    locker_point_name: Optional[str] = Query(
        None, description="Search by locker point name"
    ),
    db: AsyncSession = Depends(get_db),
    role: Role = Depends(get_current_user),
):
    query = (
        select(Locker, LockerPoint)
        .join(LockerPoint, Locker.locker_point_id == LockerPoint.id)
        .join(City, LockerPoint.city_id == City.id)
    )

    # USER: only AVAILABLE lockers
    if role == Role.user:
        query = query.where(Locker.status == "AVAILABLE")

    # Search by locker point name
    if locker_point_name:
        query = query.where(
            LockerPoint.name.ilike(f"%{locker_point_name}%")
        )

    result = await db.execute(query)
    rows = result.all()

    return [
        AllLockerResponse(
            id=locker.id,
            name=locker.name,
            status=locker.status,
            locker_point_name=locker_point.name
        )
        for locker, locker_point in rows
    ]





@router.get('/{locker_id}', response_model=AllLockerResponse)
async def get_locker(locker_id: UUID, db: AsyncSession = Depends(get_db)):
    query = (
        select(Locker, LockerPoint)
        .join(LockerPoint, Locker.locker_point_id == LockerPoint.id)
        .where(Locker.id == locker_id)
    )
    result = await db.execute(query)
    row = result.first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Locker not found")

    locker, locker_point = row
    return AllLockerResponse(
        id=locker.id,
        name=locker.name,
        status=locker.status,
        locker_point_name=locker_point.name
    )


