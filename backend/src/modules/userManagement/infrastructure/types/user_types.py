from src.shared.baseType import baseType
from dataclasses import dataclass

@dataclass
class create_requestType(baseType):
    name: str
    username: str
    password: str
    role: str

@dataclass
class update_requestType(baseType):
    id: int
    name: str
    username: str
    role: str
    password: str | None = None
    current_password: str | None = None

@dataclass
class delete_requestType(baseType):
    id: int