from fastapi import APIRouter,Depends
from app.api.v1 import lockers,users,items
from app.core.security import get_current_user
from app.api.v1.admin import routers


api_router=APIRouter()
api_router.include_router(users.router,prefix="/Auth", tags=["USERS AUTH"])

api_router.include_router(lockers.router, prefix="/lockers",
                          tags=[" USERS LOCKERS"],
                          dependencies=[Depends(get_current_user)]
                        )

api_router.include_router(items.router, 
                          prefix="/Items", 
                          tags=["ITEMS"],
                          dependencies=[Depends(get_current_user)]
    )

api_router.include_router(routers.router,
                          prefix="/Admin",
                          tags=["ADMIN ROUTERS"])