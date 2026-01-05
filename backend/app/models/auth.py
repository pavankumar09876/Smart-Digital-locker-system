from sqlalchemy import Column, Integer,String,Enum
from app.core.database import Base
import enum

class Role(enum.Enum):
    user='user'
    admin='admin'


class User(Base):
    __tablename__="users"

    id=Column(Integer,primary_key=True,index=True)
    name=Column(String, nullable=False)
    email=Column(String, unique=True)
    password=Column(String)
    role=Column(Enum(Role), default=Role.user, nullable=False)
    
    