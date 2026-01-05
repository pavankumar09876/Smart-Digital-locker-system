from datetime import datetime, timedelta,timezone
from jose import jwt,JWTError
from app.core.config import settings
from app.core.config import settings


def create_access_token(data:dict, expires_delta:timedelta|None=None):
    to_encode=data.copy()
    if expires_delta:
        expire=datetime.now(timezone.utc)+expires_delta
    else:
        expire=datetime.now(timezone.utc)+timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire})
    encoded_jwt=jwt.encode(to_encode,settings.ACCESS_SECRET_KEY,algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(data:dict, expires_delta:timedelta|None=None):
    to_encode=data.copy()
    if expires_delta:
        expire=datetime.now(timezone.utc)+expires_delta
    else:
        expire=datetime.now(timezone.utc)+timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire})
    encoded_jwt=jwt.encode(to_encode,settings.REFRESH_SECRET_KEY,algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            settings.ACCESS_SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
    except JWTError:
        return None