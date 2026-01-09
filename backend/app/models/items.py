from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Index,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class Items(Base):
    __tablename__ = "items"

    # ---------- PRIMARY ----------
    id = Column(Integer, primary_key=True, index=True)

    # ---------- ITEM DETAILS ----------
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)

    # ---------- LOCKER ----------
    locker_id = Column(
        UUID(as_uuid=True),                          
        ForeignKey("lockers.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,                                 # one locker → one item
        index=True,
    )

    # STORED | COLLECTED
    status = Column(String(20), nullable=False, default="STORED")

    # ---------- OTP ----------
    otp_hash = Column(String(255), nullable=True)
    otp_expires_at = Column(DateTime(timezone=True), nullable=True)
    otp_attempts = Column(Integer, nullable=False, default=0)

    # ---------- SENDER ----------
    your_email = Column(String(255), nullable=False)
    your_phone = Column(String(20), nullable=True)

    # ---------- RECEIVER ----------
    receiver_phone = Column(String(20), nullable=False)
    receiver_email = Column(String(255), nullable=True)

    # ---------- TIMESTAMPS ----------
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    collected_at = Column(DateTime(timezone=True), nullable=True)

    # ---------- RELATIONSHIPS ----------
    locker = relationship(
        "Locker",
        back_populates="items"
    )

    transaction = relationship(
        "Transaction",
        back_populates="item",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # ---------- INDEXES ----------
    __table_args__ = (
        Index("idx_items_locker_status", "locker_id", "status"),
    )
