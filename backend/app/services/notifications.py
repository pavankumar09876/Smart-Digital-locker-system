import smtplib
from email.message import EmailMessage
from decimal import Decimal
from twilio.rest import Client

from app.core.config import settings
from app.services.email_templates import (
    item_added_sender_html,
    item_added_receiver_html,
    item_collected_sender_html,
    item_collected_receiver_html
)


# ------------------------------------------------------------------
# External clients (initialized once)
# ------------------------------------------------------------------

_twilio_client = Client(
    settings.TWILIO_ACCOUNT_SID,
    settings.TWILIO_AUTH_TOKEN,
)


# ------------------------------------------------------------------
# Core email & SMS helpers
# ------------------------------------------------------------------

def _send_email(to: str, subject: str, html: str) -> None:
    msg = EmailMessage()
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(html, subtype="html")

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(msg)


def _send_sms(phone: str, message: str) -> None:
    _twilio_client.messages.create(
        body=message,
        from_=settings.TWILIO_PHONE_NUMBER,
        to=phone,
    )


# ------------------------------------------------------------------
# OTP notifications
# ------------------------------------------------------------------

def send_otp(contact: str, otp: str) -> None:
    if "@" in contact:
        _send_email(
            to=contact,
            subject="Locker OTP",
            html=f"<h3>Your OTP is {otp}</h3>",
        )
    else:
        _send_sms(
            phone=contact,
            message=f"Your locker OTP is {otp}",
        )


# ------------------------------------------------------------------
# Item lifecycle notifications
# ------------------------------------------------------------------

from decimal import Decimal


def notify_item_added_sender(email: str, locker_id: int) -> None:
    _send_email(
        to=email,
        subject="Item Stored Successfully",
        html=item_added_sender_html(locker_id),
    )


def notify_item_added_receiver(email: str, locker_id: int) -> None:
    _send_email(
        to=email,
        subject="Item Locked for You",
        html=item_added_receiver_html(locker_id),
    )


def notify_sender_item_collected(
    email: str,
    locker_id: int,
    amount: Decimal,
) -> None:
    _send_email(
        to=email,
        subject="Item Collected Successfully",
        html=item_collected_sender_html(locker_id, amount),
    )


def notify_receiver_item_collected(
    receiver_email: str,
    locker_id: int,
) -> None:
    _send_email(
        to=receiver_email,
        subject="Item Collected – Locker Opened",
        html=item_collected_receiver_html(locker_id),
    )
