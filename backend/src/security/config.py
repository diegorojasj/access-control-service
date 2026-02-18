import json
from pathlib import Path
from typing import Any, Dict, Optional, cast
from pyseto import DecryptError, Key, Paseto, VerifyError

# Configure Paseto defaults:
# - tokens include `iat`
# - default exp = 3600s (1 hour)
# - 60s leeway when validating exp/nbf
paseto = Paseto.new(exp=3600, include_iat=True, leeway=60)

# BASE_DIR points to the directory where this file (config.py) resides
BASE_DIR = Path(__file__).resolve().parent

PRIVATE_KEY_PATH = BASE_DIR.parent / "keys" / "private_key.pem"
PUBLIC_KEY_PATH = BASE_DIR.parent / "keys" / "public_key.pem"

# Load PEMs from files
PRIVATE_KEY_PEM = PRIVATE_KEY_PATH.read_text()
PUBLIC_KEY_PEM = PUBLIC_KEY_PATH.read_text()

# Build key objects (public)
PRIVATE_KEY = Key.new(4, "public", PRIVATE_KEY_PEM)  # signing
PUBLIC_KEY = Key.new(4, "public", PUBLIC_KEY_PEM)  # verification