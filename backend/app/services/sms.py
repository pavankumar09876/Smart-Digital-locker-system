from twilio.rest import Client
from app.core.config import settings
from app.services.notifications import notify_item_collected_sender
from decimal import Decimal
from email.message import EmailMessage
from app.services.notifications import _send_email

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

def send_otp_sms(phone: str, otp: str):
    message = client.messages.create(
        body=f"Your OTP is {otp}",
        from_=settings.TWILIO_PHONE_NUMBER,
        to=phone,
    )
    return message.sid

    


    # if phone:
    #     send_sms(phone, message)


