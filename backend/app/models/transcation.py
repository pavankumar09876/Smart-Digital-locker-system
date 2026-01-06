from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Numeric
from sqlalchemy.sql import func
from app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    invoice_no = Column(String, unique=True, index=True)

    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    locker_id = Column(Integer, ForeignKey("lockers.id"), nullable=False)

    rate_per_hour = Column(Numeric(10, 2), default=50)
    status = Column(String, default="ONGOING")  # ONGOING | COMPLETED

    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    total_amount = Column(Numeric(10, 2), nullable=True)
