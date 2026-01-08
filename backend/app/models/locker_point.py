from sqlalchemy import Column, Integer, String, ForeignKey, Text,UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid



from app.core.database import Base


class LockerPoint(Base):
    __tablename__ = "locker_points"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)  # e.g., "Public Place"
    address = Column(Text, nullable=True)  # Detailed address
    
    city_id = Column(
        UUID(as_uuid=True), 
        ForeignKey("cities.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # ONE locker point → MANY lockers
    lockers = relationship(
        "Locker",
        back_populates="locker_point",
        cascade="all, delete-orphan"
    )

    # MANY locker points → ONE city
    city = relationship(
        "City",
        back_populates="locker_points"
    )

    __table_args__ = (
    UniqueConstraint("city_id", "name", name="uq_city_lockerpoint_name"),
)
