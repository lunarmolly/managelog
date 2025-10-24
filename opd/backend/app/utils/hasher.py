from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"])

class Hasher: 
    @staticmethod
    def verify_password(plain_password, hash_password): 
        return pwd_context.verify(plain_password, hash_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str: 
        return pwd_context.hash(password)