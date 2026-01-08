import secrets
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def generate_otp():
    otp = f"{secrets.randbelow(1_000_000):06d}"
    # otp_hash = pwd_context.hash(otp)
    expiry = datetime.now(timezone.utc) + timedelta(minutes=5)
    return otp, expiry


def verify_otp(plain_otp: str, hashed_otp: str) -> bool:
    return pwd_context.verify(plain_otp, hashed_otp)
