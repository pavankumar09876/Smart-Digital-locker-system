from sqlalchemy import Column,Integer,String
from app.core.database import Base

class Locker(Base):
    __tablename__="lockers"

    id=Column(Integer,primary_key=True, index=True)
    location=Column(String)
    status=Column(String, default="AVAILABLE")
    