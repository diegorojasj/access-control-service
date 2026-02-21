
from typing import Literal
from fastapi import Response
from src.security.token import create_access_token
from datetime import datetime, timedelta, timezone
import os

from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

from src.modules.auth.infrastructure.entities.user_entity import User

expires_in = int(os.getenv("EXPIRES_IN") or "10800")

def getExpiredAt():
    return datetime.now(timezone.utc) + timedelta(seconds=expires_in)

def generate_token_by_user(user: User):
    payload = {
        "username": user.username,
        "roleName": user.role.name,
    }
    return create_access_token(str(user.id), extra=payload, expires_in=expires_in)

def setCookie(key: str, value: str, response: Response, *, httponly: bool = True, samesite: Literal['lax', 'none', 'strict'] = "lax", expires: int = expires_in):
    response.set_cookie(key, value, expires=expires, httponly=httponly, samesite=samesite)

def passwordHash(password: str):
    hasher = PasswordHash((
        Argon2Hasher(
            time_cost=2,  # Iterations (OWASP recommended)
            memory_cost=65536,  # 64MB (OWASP recommended)
            parallelism=1,  # Single thread (sufficient for web)
            hash_len=32,  # 256-bit output
        ),
    ))
    return hasher.hash(password)

def passwordVerify(password: str, hashed_password: str):
    hasher = PasswordHash((
        Argon2Hasher(
            time_cost=2,  # Iterations (OWASP recommended)
            memory_cost=65536,  # 64MB (OWASP recommended)
            parallelism=1,  # Single thread (sufficient for web)
            hash_len=32,  # 256-bit output
        ),
    ))
    return hasher.verify(hashed_password, password)