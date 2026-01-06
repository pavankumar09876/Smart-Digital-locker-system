from fastapi import APIRouter,Depends,HTTPException,status,BackgroundTasks
from sqlalchemy.sql import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from datetime import timezone
from decimal import Decimal, ROUND_UP
from sqlalchemy.orm import selectinload

from app.schemas.item import ItemResponse,ItemCreate,ItemCollect,ItemOTPRequest
from app.core.database import get_db
from app.models.locker import Locker
from app.models.items import Items
from app.services.otp import generate_otp
from app.core.hashing import Hash
from app.services.otp import verify_otp
from app.models.transcation import Transaction
from app.services.billing import calculate_bill
from app.services.notifications import (
    send_otp,
    notify_item_added_sender,
    notify_item_added_receiver,
    notify_sender_item_collected,
    notify_receiver_item_collected
)

router=APIRouter()


@router.post('/',response_model=ItemResponse)
async def add_item(data:ItemCreate,background_tasks: BackgroundTasks,db:AsyncSession=Depends(get_db)):
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
    await db.flush()   #get new_item.id

    transaction = Transaction(
        item_id=new_item.id,
        locker_id=data.locker_id,
        rate_per_hour=50
    )

    db.add(transaction)
    await db.commit()
    await db.refresh(new_item)

    background_tasks.add_task(
        notify_item_added_sender,
        data.your_email,
        data.locker_id,
)

    background_tasks.add_task(
        notify_item_added_receiver,
        data.receiver_emailid,
        data.locker_id,
)
    return new_item


@router.post("/lockers/{locker_id}/collect")
async def collect_item(locker_id: int, 
                        data:ItemCollect,
                        background_tasks: BackgroundTasks,
                        db: AsyncSession = Depends(get_db)
                        ):
    result = (
        select(Items)
        .join(Locker)
        .where(
            Locker.id == locker_id,
            Items.status == "OCCUPIED"
            )
    )
    item= (await db.execute(result)).scalar_one_or_none()

    if not item :
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No active item found in this locker"
            )

    #OTP validation
    if item.otp_expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP expired"
            )

    if not verify_otp(data.otp, item.otp_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OTP"
            )
    
    # 3. Fetch active transaction
    result = await db.execute(
        select(Transaction).where(
            Transaction.item_id == item.id,
            Transaction.ended_at.is_(None),
        )
    )
    transaction:Transaction|None = result.scalar_one_or_none()

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Transaction not found",
        )

    end_time = datetime.now(timezone.utc)
    # BILL CALCULATION (AUTO)
    total_amount = calculate_bill(item.created_at)

    # Fetch the email before scheduling background task
    your_email = item.your_email
    receiver_email = item.receiver_email
    locker_no = locker_id
    amount = total_amount

    # Update transaction
    transaction.ended_at = end_time
    transaction.total_amount = total_amount

    # Update item
    item.status = "COLLECTED"
    item.collected_at = end_time

    locker = await db.get(Locker, locker_id)
    locker.status = "AVAILABLE"

   

    await db.commit()
    
    # Background notification (SAFE)
    background_tasks.add_task(
        notify_sender_item_collected,
        your_email,
        locker_no,
        amount,
    )

    background_tasks.add_task(
        notify_receiver_item_collected,
        receiver_email,
        locker_no,
    )

    return {
        # "item_id": item.id,
        # "locker_id": locker_id,
        # "total_amount": total_amount,
        "detail": "Item collected successfully and locker is now available",
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

    otp,expiry = generate_otp()

    # Store hashed OTP and expiry in the item record
    item.otp_hash = Hash.hash_value(otp)
    item.otp_expires_at = expiry
    await db.commit()

    # Send OTP via email or SMS
    send_otp(data.contact, otp)
    return {"detail": "OTP sent successfully"}