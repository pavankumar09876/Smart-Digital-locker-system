from twilio.rest import Client
from app.core.config import settings
from app.services.notifications import send_email_to_user_after_receiveItem
client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

def send_otp_sms(phone: str, otp: str):
    message = client.messages.create(
        body=f"Your OTP is {otp}",
        from_=settings.TWILIO_PHONE_NUMBER,
        to=phone,
    )
    return message.sid

    
def notify_sender_item_collected(email: str, locker_id: int):
    if not email:
        return

    message = f"Your item from locker {locker_id} has been collected successfully."

    send_email_to_user_after_receiveItem(
        to=email,
        subject="Item Collected",
        body=message
    )


    # if phone:
    #     send_sms(phone, message)
