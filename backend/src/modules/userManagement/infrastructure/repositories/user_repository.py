from typing import Any
from sqlalchemy.orm import Session
from sqlalchemy.engine import Row

from src.modules.auth.infrastructure.entities.user_entity import User

class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> list[dict[str, Any]]:
        rows = self.session.query(User.id, User.name, User.username, User._role.label("role"), User.status).order_by(User.id).all()
        return [row._asdict() for row in rows]

    def get_by_username(self, username: str) -> Row[Any] | None:
        return self.session.query(User.id, User.name, User.username, User._role.label("role")).filter(User.username == username).first()

    def get_by_role(self, role: str) -> list[Row[Any]]:
        return self.session.query(User.id, User._role.label("role")).filter(User._role == role).all()

    def create(self, user: User) -> User:
        self.session.add(user)
        return user

    def update(self, user: User) -> User:
        self.session.add(user)
        return user

    def get_by_id(self, id: int) -> User | None:
        return self.session.query(User).filter(User.id == id).first()