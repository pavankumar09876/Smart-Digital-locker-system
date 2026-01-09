import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base



class State(Base):
    __tablename__ = "states"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)

    # ONE state → MANY cities
    cities = relationship(
        "City",
        back_populates="state",
        cascade="all, delete-orphan",
        # lazy="raise"
    )
