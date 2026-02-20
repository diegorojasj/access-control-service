from src.shared.baseModel import Base
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import Mapped
from src.modules.permissions.infrastructure.entities.role_entity import Role

class User(Base):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[Role] = mapped_column(String(50), nullable=False)
    
    def __repr__(self) -> str:
        return f"<User(name='{self.name}')>"