from twilio.rest import Client
import smtplib
from email.mime.text import MIMEText
from app.core.config import settings


def send_otp(contact: str, otp: str):
    if "@" in contact:
        send_email(contact, otp)
    else:
        send_sms(contact, otp)

def send_sms(phone: str, otp: str):
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    client.messages.create(
        body=f"Your locker OTP is {otp}",
        from_=settings.TWILIO_PHONE_NUMBER,
        to=phone
    )

def send_email(email: str, otp: str):
    msg = MIMEText(f"Your locker OTP is {otp}")
    msg["Subject"] = "Locker OTP"
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = email

    server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
    server.starttls()
    server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
    server.send_message(msg)
    server.quit()

def send_email_to_user_after_receiveItem(to: str, subject: str, body: str):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to

    server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
    server.starttls()
    server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
    server.send_message(msg)
    server.quit()

