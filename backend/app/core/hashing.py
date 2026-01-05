from passlib.context import CryptContext


pwd_context=CryptContext(
    schemes=["argon2"], 
    deprecated="auto"
    )
class Hash:
    @staticmethod
    def hashed_password(password:str)-> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password:str, hashed_password:str) -> bool:
        return pwd_context.verify(plain_password,hashed_password)
    
    
#OPT hash and verify
    @staticmethod
    def hash_value(value: str) -> str:
        return pwd_context.hash(value)

    @staticmethod
    def verify_value(value: str, hashed: str) -> bool:
        return pwd_context.verify(value, hashed)


