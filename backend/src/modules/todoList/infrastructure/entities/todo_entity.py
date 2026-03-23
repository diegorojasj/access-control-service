from src.modules.auth.infrastructure.entities.user_entity import User
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from src.shared.baseModel import Base
from sqlalchemy import Integer, String, DateTime
from sqlalchemy.orm import mapped_column, Mapped
from datetime import datetime, timezone

class Todo(Base):
    __tablename__ = "todo"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
    task: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[int] = mapped_column(Integer, nullable=False, default=1) # 1 = pending, 0 = completed
    order: Mapped[int] = mapped_column(Integer, nullable=False)
    _user: Mapped[int] = mapped_column("user", Integer, ForeignKey("user.id"), nullable=False)
    user: Mapped[User] = relationship("User", foreign_keys=[_user])
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    def __repr__(self) -> str:
        return f"<Todo(task='{self.task}')>"