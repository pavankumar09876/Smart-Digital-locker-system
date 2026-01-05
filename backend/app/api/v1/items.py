from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.sql import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from fastapi import BackgroundTasks


from app.schemas.item import ItemResponse,ItemCreate,ItemCollect,ItemOTPRequest
from app.core.database import get_db
from app.models.locker import Locker
from app.models.items import Items
from app.services.otp import generate_otp
from app.core.hashing import Hash
from app.services.notifications import send_otp
from app.services.otp import verify_otp
# from app.services.sms import notify_sender_item_collected
from app.services import sms


router=APIRouter()

@router.post('/',response_model=ItemResponse)
async def add_item(data:ItemCreate, db:AsyncSession=Depends(get_db)):
    result= await db.execute(select(Locker).where(Locker.id==data.locker_id))
    locker=result.scalar_one_or_none()

    if not locker:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{data.locker_id} Locker Not Found")

    if locker.status != "AVAILABLE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{locker.id} Locker is already occupied"
        )

    new_item=Items(
        name=data.name,
        description=data.description,
        locker_id=data.locker_id,
        your_email=data.your_email,
        receiver_phone=data.receiver_phone_number,
        receiver_email=data.receiver_emailid,
        status="OCCUPIED"
        )
    locker.status="OCCUPIED"

    db.add(new_item)
    await db.commit()

    await db.refresh(new_item)

    return new_item


@router.post("/lockers/{locker_id}/collect")
async def collect_item(locker_id: int, 
                        data:ItemCollect,
                        background_tasks: BackgroundTasks,
                        db: AsyncSession = Depends(get_db)
                        ):
    item = (
        await db.execute(
        select(Items)
        .join(Locker)
        .where(
            Locker.id == locker_id,
            Items.status == "OCCUPIED"
            )
    )).scalar_one_or_none()

    if not item :
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No item to collect"
            )

    if not verify_otp(data.otp, item.otp_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OTP"
            )

    if item.otp_expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP expired"
            )
    
    sender_email = item.your_email
    # sender_phone = item.your_phone
    item_id=item.id

    # ✅ Update item
    item.status = "COLLECTED"
    item.collected_at = func.now()

    locker = (
        await db.execute(
            select(Locker).where(Locker.id == locker_id,)
            )
        ).scalar_one()

    locker.status = "AVAILABLE"

    await db.commit()

      # Background notification (SAFE)
    background_tasks.add_task(
        sms.notify_sender_item_collected,
        sender_email,
        locker_id
    )

    return {
        "item_id": item_id,
        "detail": f"Item collected successfully, {locker_id} locker is now available"
    }


@router.post("/lockers/{locker_id}/request-otp")
async def request_otp(
    locker_id: int, 
    data: ItemOTPRequest, 
    db: AsyncSession = Depends(get_db)
    ):
    item = (
        await db.execute(
        select(Items)
        .where(
            Items.locker_id == locker_id, 
            Items.status == "OCCUPIED"
            )
        )
    ).scalar_one_or_none()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Item not found"
            )

    if data.contact not in [item.receiver_phone, item.receiver_email]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Unauthorized receiver"
            )

    otp, otp_hash,expiry = generate_otp()

    # Store hashed OTP and expiry in the item record
    item.otp_hash=otp_hash
    item.otp_hash = Hash.hash_value(otp)
    item.otp_expires_at = expiry
    await db.commit()

    # Send OTP via email or SMS
    send_otp(data.contact, otp)
    return {"detail": "OTP sent successfully"}