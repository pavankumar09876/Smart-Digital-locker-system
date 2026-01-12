from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select, func
from typing import List
from sqlalchemy.orm import joinedload
from uuid import UUID

from app.schemas.state import StateResponse, StateCreate, StateUpdate
from app.core.database import get_db
from app.models.state import State
from app.core.security import require_role
from app.models.auth import Role, User
from app.models.city import City
from app.models.locker_point import LockerPoint

router = APIRouter()

@router.get("/", response_model=StateResponse)
async def get_state(
    state: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(State)
        .options(
            selectinload(State.cities)
            .selectinload(City.locker_points)
        )
        .where(func.lower(State.name) == state.lower())
    )

    state_obj = result.scalar_one_or_none()

    if not state_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="State not found"
        )

    return state_obj

@router.get("/all", response_model=List[StateResponse])
async def get_states(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(State).options(
            selectinload(State.cities)
            .selectinload(City.locker_points)
            .selectinload(LockerPoint.lockers)
        )
    )
    return result.scalars().all()

@router.post("/", response_model=StateResponse, status_code=status.HTTP_201_CREATED)
async def create_state(
    state: StateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(Role.admin))
):
    result = await db.execute(
        select(State).where(State.name == state.name)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="State already exists"
        )

    new_state = State(name=state.name)
    db.add(new_state)
    await db.commit()
    await db.refresh(new_state)

    return StateResponse(
        id=new_state.id,
        name=new_state.name,
        cities=[]   # ✅ explicitly set
    )

@router.put('/{state_id}', response_model=StateResponse)
async def update_state(
    state_id: UUID,
    state_update: StateUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(Role.admin))
    ):
    result = await db.execute(
    select(State)
    .options(selectinload(State.cities))
    .where(State.id == state_id)
    )
    state = result.scalar_one_or_none()

    if not state:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="State not found")
    
    if state_update.name is not None:
        state.name = state_update.name
    
    await db.commit()
    await db.refresh(state)
    return state

@router.delete('/{state_id}')
async def delete_state(
    state_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(Role.admin))
):
    result = await db.execute(
        select(State).where(State.id == state_id)
    )
    state = result.scalar_one_or_none()

    if not state:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="State not found"
        )

    await db.delete(state)
    await db.commit()
    return {"message": "State deleted successfully"}
