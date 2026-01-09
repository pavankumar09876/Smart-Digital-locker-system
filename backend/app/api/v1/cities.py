from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.models.city import City
from app.schemas.city import CityCreate, CityUpdate, CityResponse,CityCreateResponse
from app.models.state import State
from app.models.locker_point import LockerPoint

router = APIRouter()


@router.post("/",response_model=CityCreateResponse,status_code=status.HTTP_201_CREATED)
async def create_city(
    city: CityCreate,
    db: AsyncSession = Depends(get_db),
):
    # Check if state exists
    result = await db.execute(
        select(State).where(State.id == city.state_id)
    )
    state = result.scalar_one_or_none()

    if not state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid state_id: State does not exist"
        )

    # check duplicate city per state
    result = await db.execute(
        select(City).where(
            City.name == city.name,
            City.state_id == city.state_id
        )
    )
    existing_city = result.scalar_one_or_none()

    if existing_city:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="City already exists in this state"
        )

    # Create city
    new_city = City(
        name=city.name.strip().title(),
        state_id=city.state_id
    )

    db.add(new_city)
    await db.commit()
    await db.refresh(new_city)

    return new_city


@router.get("/", response_model=List[CityResponse])
async def get_all_cities(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(City).options(selectinload(City.locker_points)
                             .selectinload(LockerPoint.lockers)
                             )
    )
    return result.scalars().all()


@router.get("/{city_id}", response_model=CityResponse)
async def get_city_by_id(
    city_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(City)
        .options(selectinload(City.locker_points))
        .where(City.id == city_id)
    )

    city = result.scalar_one_or_none()

    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="City not found"
        )

    return city

@router.get(
    "/by-state/{state_name}/{city_name}",
    response_model=CityResponse
)
async def get_city_by_state_name(
    state_name: str,
    city_name: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(City)
        .join(City.state)
        .options(selectinload(City.locker_points))
        .where(
            State.name.ilike(state_name),
            City.name.ilike(city_name),
        )
    )

    city = result.scalar_one_or_none()

    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="City not found for given state"
        )

    return city


@router.put("/{city_id}", response_model=CityResponse)
async def update_city(
    city_id: UUID,
    city_data: CityUpdate,
    db: AsyncSession = Depends(get_db),
):
    # Load city WITH locker_points
    result = await db.execute(
        select(City)
        .options(selectinload(City.locker_points))
        .where(City.id == city_id)
    )
    city = result.scalar_one_or_none()

    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="City not found"
        )

    update_data = city_data.model_dump(exclude_unset=True)

    # Validate new state_id if provided
    if "state_id" in update_data:
        state = await db.get(State, update_data["state_id"])
        if not state:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid state_id"
            )

    # Apply updates
    for key, value in update_data.items():
        if key == "name":
            value = value.strip().title()
        setattr(city, key, value)

    await db.commit()
    await db.refresh(city)

    return city


@router.delete(
    "/{city_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_city(
    city_id: int,
    db: AsyncSession = Depends(get_db),
):
    city = await db.get(City, city_id)

    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="City not found"
        )

    await db.delete(city)
    await db.commit()
