from src.shared.baseType import baseType
from dataclasses import dataclass
from typing import Optional

@dataclass
class create_requestType(baseType):
    name: str
    description: Optional[str] = None

@dataclass
class update_requestType(baseType):
    name: str
    description: Optional[str] = None

@dataclass
class onlyName_requestType(baseType):
    name: str
