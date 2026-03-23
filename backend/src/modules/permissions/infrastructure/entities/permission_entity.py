from __future__ import annotations
from typing import TYPE_CHECKING
from src.shared.baseModel import Base
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy.orm import Mapped

if TYPE_CHECKING:
    from src.modules.roleManagement.infrastructure.entities.role_entity import Role

class Permission(Base):
    __tablename__ = "permission"
    name: Mapped[str] = mapped_column(String(50), primary_key=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    role_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("roles.id"), nullable=True)
    role: Mapped[Role | None] = relationship("Role", back_populates="permissions")

    def __repr__(self) -> str:
        return f"<Permission(name='{self.name}')>"