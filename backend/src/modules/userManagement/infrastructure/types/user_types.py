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
    password: str
    role: str