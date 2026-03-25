from sqlalchemy import Column, ForeignKey, Integer, String, Table
from src.shared.baseModel import Base

role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("roles.id"), primary_key=True),
    Column("permission_name", String(50), ForeignKey("permission.name"), primary_key=True),
)
