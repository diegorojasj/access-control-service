from src.shared.baseType import baseType
from dataclasses import dataclass

@dataclass
class create_requestType(baseType):
    task: str
    description: str

@dataclass
class update_requestType(baseType):
    id: int
    task: str
    description: str

@dataclass
class updateOrder_requestType(baseType):
    list: dict[int, int] # key = id, value = order

@dataclass
class onlyId_requestType(baseType):
    id: int