from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.database import Base



class City(Base):
    __tablename__ = "cities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    
    state_id = Column(
        UUID(as_uuid=True), 
        ForeignKey("states.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # ONE city → MANY locker points
    locker_points = relationship(
        "LockerPoint",
        back_populates="city",
        cascade="all, delete-orphan"
    )

    # MANY cities → ONE state
    state = relationship(
        "State",
        back_populates="cities"
    )

    __table_args__ = (
        {"schema": None},  # or specify schema if needed
    )
