from src.shared.baseType import baseType
from dataclasses import dataclass

@dataclass
class login_requestType(baseType):
    username: str
    password: str