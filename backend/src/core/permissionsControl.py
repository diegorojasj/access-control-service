from fastapi import HTTPException
from typing import List

import hashlib
import re
import hmac
from src.security.config import PRIVATE_KEY_PEM

class PermissionControl:
    def __init__(self):
        pass

    def _permissionEntity(self) -> List[str]:
        return [
            "todo",
            "user",
            "role",
            "permission"
        ]

    def _permissionAction(self) -> List[str]:
        return [
            "all",
            "view",
            "create",
            "update",
            "delete"
        ]

    def _customPermissionAction(self) -> dict[str, List[str]]:
        return {
            "todo": ["check", "uncheck"]
        }

    def getPermissions(self) -> List[str]:
        entities = self._permissionEntity()
        actions = self._permissionAction()
        customActions = self._customPermissionAction()
        permissions = []
        for entity in entities:
            for action in actions:
                permissions.append(f"{entity}:{action}")
            if entity in customActions:
                for action in self._customPermissionAction()[entity]:
                    permissions.append(f"{entity}:{action}")
        return permissions
    
    def requirePermission(self, permission: str):
        if permission not in self.getPermissions():
            raise HTTPException(status_code=403, detail="Permission denied")

    def encodePermission(self, permission: str) -> str:
        # Validate permission format
        if not re.match(r"^[a-z]+:[a-z]+$", permission):
            raise ValueError(f"Invalid permission format: {permission}")
        # Encode to UTF-8 bytes
        bytes_data = permission.encode("utf-8")

        # Convert each byte to 8-bit binary string
        binary_strings = [format(byte, "08b") for byte in bytes_data]

        return " ".join(binary_strings)
    
    def decodePermission(self, binary_permission: str) -> str:
        try:
            # Split by spaces
            binary_strings = binary_permission.split(" ")
    
            # Validate each binary string is exactly 8 bits
            for bin_str in binary_strings:
                if not re.match(r"^[01]{8}$", bin_str):
                    raise ValueError(f"Invalid binary format: {bin_str}")
    
            # Convert binary strings to bytes
            bytes_data = bytes([int(bin_str, 2) for bin_str in binary_strings])
    
            # Decode UTF-8
            decoded = bytes_data.decode("utf-8")
    
            # Validate permission format (UPPERCASE_WITH_UNDERSCORES or dots)
            if not re.match(r"^[A-Z_\.]+$", decoded):
                raise ValueError(f"Invalid permission format: {decoded}")
    
            return decoded
        except Exception as e:
            raise ValueError(f"Failed to decode permission: {e}")