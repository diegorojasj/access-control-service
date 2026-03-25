from sqlalchemy.orm import relationship
from src.modules.permissions.infrastructure.entities.permission_entity import Permission
from src.modules.roleManagement.infrastructure.entities.role_permission_entity import role_permissions
from datetime import datetime, timezone
from sqlalchemy import DateTime, String, Integer, Boolean
from sqlalchemy.orm import mapped_column, Mapped
from src.shared.baseModel import Base

class Role(Base):
    __tablename__ = "roles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    permissions: Mapped[list["Permission"]] = relationship("Permission", secondary=role_permissions)
    is_immutable: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))