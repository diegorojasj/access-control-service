
from typing import Literal
from fastapi import Response
from src.security.token import create_access_token
from datetime import datetime, timedelta, timezone
import os

from src.modules.auth.infrastructure.entities.user_entity import User

expires_in = os.getenv("expires_in", 10800)

def getExpiredAt():
    return datetime.now(timezone.utc) + timedelta(seconds=int(expires_in))

def generate_token_by_user(user: User):
    payload = {
        "username": user.username,
        "roleName": user.role.name,
    }
    return create_access_token(str(user.id), extra=payload, expires_in=int(expires_in))

def setCookie(key: str, value: str, response: Response, *, httponly: bool = True, samesite: Literal['lax', 'none', 'strict'] = "lax", expires: int = int(expires_in)):
    response.set_cookie(key, value, expires=expires, httponly=httponly, samesite=samesite)