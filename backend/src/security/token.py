import json
from pathlib import Path
from typing import Any, Dict, Optional, cast
from pyseto import DecryptError, Key, Paseto, VerifyError
from .config import PRIVATE_KEY, PUBLIC_KEY, paseto

def create_access_token(
    sub: str,
    *,  
    aud: str = "accessControlServiceApi",  
    iss: str = "accessControlService-backend",  
    extra: Optional[dict] = None,  
    expires_in: Optional[int] = None,  
) -> str:
    """
    Make a Token
    """
    payload = {"sub": sub, "aud": aud, "iss": iss}
    if extra:
        payload.update(extra)

    footer = {"kid": PUBLIC_KEY.to_paserk_id()}

    token_bytes = paseto.encode(
        PRIVATE_KEY,
        payload,
        footer=footer,
        serializer=json,
        exp=(expires_in or 0),
    )
    return token_bytes.decode()

def verify_token(token: str, *, aud: str = "accessControlServiceApi") -> Optional[Dict[str, Any]]:
    """
    Verify Token
    """
    try:
        decoded = paseto.decode(
            PUBLIC_KEY,
            token,
            deserializer=json,
            aud=aud,
        )
        payload = decoded.payload
        if isinstance(payload, (bytes, bytearray)):
            return cast(Dict[str, Any], json.loads(payload.decode()))
        if isinstance(payload, str):
            return cast(Dict[str, Any], json.loads(payload))
        return payload
    except (VerifyError, DecryptError, ValueError) as _:
        return None