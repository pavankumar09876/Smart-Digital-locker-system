from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Numeric
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    invoice_no = Column(String, unique=True, index=True)

    item_id = Column(
        Integer,
        ForeignKey("items.id", ondelete="CASCADE"),
        nullable=False,
        unique=True               # one transaction per item
    )

    locker_id = Column(
        UUID(as_uuid=True),      
        ForeignKey("lockers.id", ondelete="CASCADE"),
        nullable=False
    )

    rate_per_hour = Column(Numeric(10, 2), default=50)  # ₹50/hour
    status = Column(String, default="ONGOING")          # ONGOING | COMPLETED

    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    total_amount = Column(Numeric(10, 2), nullable=True)

    # ---------- RELATIONSHIP ----------
    item = relationship(
        "Items",
        back_populates="transaction"
    )
