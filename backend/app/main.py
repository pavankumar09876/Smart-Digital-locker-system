from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import init_db
from app.api.v1 import routers

app=FastAPI(title="Smart Digital Locker🔐",
            description='''This project implements a secure, contactless item exchange system using smart lockers.\n
It allows a sender to deposit an item into a locker and a receiver to collect it later using secure credentials (OTP), without both parties meeting in person.'''
            )


app.include_router(routers.api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React
        "http://localhost:5173",  # Vite
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/', tags=['Root'])
async def root():
    from fastapi.responses import RedirectResponse

    return RedirectResponse(url="http://127.0.0.1:8000/docs")

@app.on_event("startup")
async def startup():
    print("tables are created")
    await init_db()