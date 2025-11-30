# flask-backend/utils_auth.py
import random
import string

def generate_otp(length: int = 4) -> str:
    """Generate numeric OTP of given length (default 4)."""
    start = 10**(length-1)
    end = (10**length) - 1
    return str(random.randint(start, end))

def generate_password(length: int = 8) -> str:
    """Generate a random password (alphanumeric)."""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))
