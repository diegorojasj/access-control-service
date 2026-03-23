from src.shared.baseType import baseType
from dataclasses import dataclass

@dataclass
class create_requestType(baseType):
    name: str
    description: str

@dataclass
class update_requestType(baseType):
    id: int
    name: str
    description: str

@dataclass
class onlyId_requestType(baseType):
    id: int