from src.shared.baseModel import Base
from sqlalchemy import String
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import Mapped

class Permission(Base):
    __tablename__ = "permission"
    name: Mapped[str] = mapped_column(String(50), primary_key=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    
    def __repr__(self) -> str:
        return f"<Permission(name='{self.name}')>"