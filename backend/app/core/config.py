from datetime import timedelta
from pydantic_settings import BaseSettings,SettingsConfigDict
from pydantic import Field

OTP_EXPIRY_MINUTES = 10


class Settings(BaseSettings):
    DATABASE_URL: str = Field(..., env="DATABASE_URL")

    ACCESS_SECRET_KEY:str = Field(..., env="ACCESS_SECRET_KEY")
    REFRESH_SECRET_KEY:str= Field(...,env="REFRESH_SECRET_KEY")
    ALGORITHM:str = Field(..., env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES:int =Field(..., env="ACCESS_TOKEN_EXPIRE_MINUTES")
    REFRESH_TOKEN_EXPIRE_MINUTES:int=Field(..., env="REFRESH_TOKEN_EXPIRE_MINUTES")

    TWILIO_ACCOUNT_SID: str = Field(..., env="TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN: str = Field(..., env="TWILIO_AUTH_TOKEN")
    TWILIO_PHONE_NUMBER: str = Field(..., env="TWILIO_PHONE_NUMBER")
    SMTP_HOST: str = Field(..., env="SMTP_HOST")
    SMTP_PORT: int = Field(..., env="SMTP_PORT")
    SMTP_USERNAME: str = Field(..., env="SMTP_USERNAME")
    SMTP_PASSWORD: str = Field(..., env="SMTP_PASSWORD")
    EMAIL_FROM: str = Field(..., env="EMAIL_FROM")
    
    class Config:
        env_file = "app/.env"   
        env_file_encoding = "utf-8"

settings = Settings()
