import secrets
from datetime import datetime, timedelta
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


# Generate OTP
def generate_otp() -> tuple[str, str, datetime]:
    """
    Generate a 6-digit OTP, its hash, and expiry datetime.
    Returns:
        otp: str (plain OTP to send)
        otp_hash: str (hashed OTP to store)
        expiry: datetime (UTC)
    """
    otp = f"{secrets.randbelow(1_000_000):06d}"
    otp_hash = pwd_context.hash(otp)
    expiry = datetime.utcnow() + timedelta(minutes=5)
    return otp, otp_hash, expiry


# Verify OTP
def verify_otp(plain_otp: str, hashed_otp: str) -> bool:
    """
    Verify OTP against stored hash
    """
    return pwd_context.verify(plain_otp, hashed_otp)
