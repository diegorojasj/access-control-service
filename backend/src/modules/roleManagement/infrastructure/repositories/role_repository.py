from typing import Any
from sqlalchemy.orm import Session

from src.modules.roleManagement.infrastructure.entities.role_entity import Role

class RoleRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> list[dict[str, Any]]:
        rows = self.session.query(Role.id, Role.name, Role.description, Role.is_immutable).order_by(Role.id).all()
        return [row._asdict() for row in rows]

    def get_by_id(self, id: int) -> Role | None:
        return self.session.query(Role).filter(Role.id == id).first()

    def get_by_name(self, name: str) -> Role | None:
        return self.session.query(Role).filter(Role.name == name).first()

    def create(self, role: Role) -> Role:
        self.session.add(role)
        return role

    def update(self, role: Role) -> Role:
        self.session.add(role)
        return role

    def delete(self, role: Role) -> Role:
        self.session.delete(role)
        return role
