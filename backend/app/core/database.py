from sqlalchemy.orm import sessionmaker,declarative_base
from sqlalchemy.ext.asyncio import create_async_engine,AsyncSession  
from typing import AsyncGenerator
from app.core.config import settings



engine=create_async_engine(
    settings.DATABASE_URL,
    future=True
    )

asyncSessionLocal=sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    class_=AsyncSession
    )

Base=declarative_base()

async def get_db() ->AsyncGenerator[AsyncSession,None]:
    async with asyncSessionLocal() as session:
        yield session

async def init_db():
    async with engine.begin() as conn:
        print("this init function are called")
        await conn.run_sync(Base.metadata.create_all)
