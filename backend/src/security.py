import json
from pathlib import Path
from typing import Any, Dict, Optional, cast

# BASE_DIR points to the directory where this file (security.py) resides
BASE_DIR = Path(__file__).resolve().parent

PRIVATE_KEY_PATH = BASE_DIR / "keys" / "private_key.pem"
PUBLIC_KEY_PATH = BASE_DIR / "keys" / "public_key.pem"

# Load PEMs from files
PRIVATE_KEY_PEM = PRIVATE_KEY_PATH.read_text()
PUBLIC_KEY_PEM = PUBLIC_KEY_PATH.read_text()

# Build key objects (public)
PRIVATE_KEY = Key.new(4, "public", PRIVATE_KEY_PEM)  # signing
PUBLIC_KEY = Key.new(4, "public", PUBLIC_KEY_PEM)  # verification

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

def verify_token(token: str, *, aud: str = "agriLynxProApis") -> Optional[Dict[str, Any]]:
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
        return cast(Dict[str, Any], payload)
    except (VerifyError, DecryptError, ValueError) as _:
        return None