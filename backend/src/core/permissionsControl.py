import os, base64, re
from typing import List
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from fastapi import HTTPException
from src.core.context import get_current_user_id, get_current_username
from src.core.database import Session
from src.modules.auth.infrastructure.entities.user_entity import User
from src.modules.userManagement.infrastructure.repositories.user_repository import UserRepository

# Must match frontend utils.tsx constants
_SALT_BYTES = 16
_IV_BYTES   = 12
_ITERATIONS = 100_000


def _derive_key(secret: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=_ITERATIONS,
    )
    return kdf.derive(secret.encode("utf-8"))


class PermissionControl:
    def __init__(self):
        pass

    def _permissionEntity(self) -> List[str]:
        return [
            "allinone", # Master entity to allow all entities
            "todo",
            "user",
            "role"
        ]

    def _permissionAction(self) -> List[str]:
        return [
            "all", # include all actions
            "view", # Only view action
            "create", # Only create action
            "update", # Only update action
            "delete" # Only delete action
        ]

    def _customPermissionAction(self) -> dict[str, List[str]]:
        return {
            "todo": ["check", "uncheck"],
            "user": ["suspend", "unsuspend"]
        }

    def __hidePermissionEntity(self) -> List[str]:
        return ["allinone"]

    def __hidePermissionAction(self) -> dict[str, List[str]]:
        return {
            "user": ["delete"]
        }

    def getPermissions(self) -> List[str]:
        entities = self._permissionEntity()
        actions = self._permissionAction()
        customActions = self._customPermissionAction()
        hideEntity = self.__hidePermissionEntity()
        hideAction = self.__hidePermissionAction()
        permissions = []
        for entity in entities:
            if entity in hideEntity:
                continue
            for action in actions:
                if entity in hideAction and action in hideAction[entity]:
                    continue
                permissions.append(f"{entity}:{action}")
            if entity in customActions:
                for action in self._customPermissionAction()[entity]:
                    permissions.append(f"{entity}:{action}")
        return permissions

    def _check(self, permission: str, *, ignoreUserSuspended: bool = False, user: User | None = None) -> None:
        if not re.match(r"^[a-z]+:[a-z]+$", permission):
            raise ValueError(f"Invalid permission format: {permission}")
        with Session() as session:
            if user is None:
                userId = get_current_user_id()
                if userId is None:
                    raise HTTPException(status_code=401, detail="User not authenticated")
                userRepository = UserRepository(session)
                user = userRepository.get_by_id(int(userId))
            if user is None:
                raise HTTPException(status_code=404, detail="User not found")
            elif 'allinone:all' in user.role.permissions:
                return
            elif f'allinone:{permission.split(":")[1]}' in user.role.permissions:
                return
            elif not ignoreUserSuspended and user.status == 0:
                raise HTTPException(status_code=403, detail="User is suspended")
            elif permission not in self.getPermissions():
                raise HTTPException(status_code=403, detail="Permission denied")
            elif permission not in user.role.permissions:
                raise HTTPException(status_code=403, detail="Permission denied")

    def requirePermission(self, permission: str, *, ignoreUserSuspended: bool = False):
        """Factory for FastAPI Depends(). Returns a callable invoked per request."""
        def dependency() -> None:
            self._check(permission, ignoreUserSuspended=ignoreUserSuspended)
        return dependency

    def checkPermission(self, permission: str, *, ignoreUserSuspended: bool = False, user: User | None = None) -> None:
        """Direct permission check for use inside service methods."""
        self._check(permission, ignoreUserSuspended=ignoreUserSuspended, user=user)

    def encodePermission(self, permission: str) -> str:
        """AES-GCM encrypt a permission string keyed by the current user's username.
        Format: base64(salt[16] + iv[12] + ciphertext) — matches frontend decrypt()."""
        if not re.match(r"^[a-z]+:[a-z]+$", permission):
            raise ValueError(f"Invalid permission format: {permission}")

        username = get_current_username()
        if not username:
            raise ValueError("No authenticated user context for permission encoding")

        salt = os.urandom(_SALT_BYTES)
        iv   = os.urandom(_IV_BYTES)
        key  = _derive_key(username, salt)

        ciphertext = AESGCM(key).encrypt(iv, permission.encode("utf-8"), None)
        packed = salt + iv + bytes(ciphertext)
        return base64.b64encode(packed).decode("utf-8")

    def decodePermission(self, encoded: str, username: str) -> str:
        """AES-GCM decrypt a permission string using the provided username as key material."""
        try:
            packed     = base64.b64decode(encoded)
            salt       = packed[:_SALT_BYTES]
            iv         = packed[_SALT_BYTES:_SALT_BYTES + _IV_BYTES]
            ciphertext = packed[_SALT_BYTES + _IV_BYTES:]

            key       = _derive_key(username, salt)
            plaintext = AESGCM(key).decrypt(iv, ciphertext, None)
            decoded   = plaintext.decode("utf-8")

            if not re.match(r"^[a-z]+:[a-z]+$", decoded):
                raise ValueError(f"Invalid permission format: {decoded}")

            return decoded
        except Exception as e:
            raise ValueError(f"Failed to decode permission: {e}")
