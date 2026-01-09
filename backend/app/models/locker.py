import uuid
from sqlalchemy import Column, String, Integer, ForeignKey,UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class Locker(Base):
    __tablename__ = "lockers"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    name = Column(String(100), nullable=False)

    locker_point_id = Column(
        UUID(as_uuid=True),
        ForeignKey("locker_points.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    status = Column(String, default="AVAILABLE")  # AVAILABLE | OCCUPIED

    # ONE locker → ONE item
    items = relationship(
        "Items",
        back_populates="locker",
        uselist=False,
        cascade="all, delete-orphan"
    )

    # MANY lockers → ONE locker point
    locker_point = relationship(
        "LockerPoint",
        back_populates="lockers"
    )

    __table_args__ = (
        UniqueConstraint(
                        "locker_point_id",
                        "name",
                        name="uq_lockerpoint_locker_name"
                        ),
                    )