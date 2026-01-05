from sqlalchemy import Column,String,Integer,ForeignKey,DateTime
from app.core.database import Base
from sqlalchemy.sql import func

class Items(Base):
    __tablename__="items"

    id= Column(Integer,primary_key=True, index=True)
    name= Column(String, nullable=True)
    description= Column(String)
    locker_id= Column(Integer, ForeignKey("lockers.id"), nullable=False)
    status = Column(String, nullable=False, default="STORED")

    otp_hash = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)

    your_email = Column(String, nullable=True)
    your_phone = Column(String, nullable=True)

    receiver_phone = Column(String, nullable=True)
    receiver_email = Column(String, nullable=True)

    created_at= Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
        )
    
    collected_at = Column(DateTime(timezone=True), nullable=True)