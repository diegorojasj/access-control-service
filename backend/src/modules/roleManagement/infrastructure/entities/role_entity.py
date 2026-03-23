from sqlalchemy.orm import relationship
from src.modules.permissions.infrastructure.entities.permission_entity import Permission
from datetime import datetime, timezone
from sqlalchemy import DateTime, String, Integer, Table, Column, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped
from src.shared.baseModel import Base

role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("roles.id"), primary_key=True),
    Column("permission_name", String(50), ForeignKey("permission.name"), primary_key=True),
)

class Role(Base):
    __tablename__ = "roles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    permissions: Mapped[list["Permission"]] = relationship("Permission", secondary=role_permissions)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))