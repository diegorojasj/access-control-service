from src.shared.baseModel import Base
from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import mapped_column, Mapped, relationship
from src.modules.roleManagement.infrastructure.entities.role_entity import Role

class User(Base):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    username: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    _role: Mapped[str] = mapped_column("role", String(50), ForeignKey("roles.name"), nullable=False)
    role: Mapped[Role] = relationship("Role", foreign_keys=[_role])
    status: Mapped[int] = mapped_column(Integer, nullable=False, default=1) # 1 = active, 0 = inactive
    
    def __repr__(self) -> str:
        return f"<User(name='{self.name}')>"