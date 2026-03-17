from src.modules.roleManagement.infrastructure.entities.role_entity import Role

class RoleRepository:
    def __init__(self, session):
        self.session = session

    def get_all(self):
        rows = self.session.query(Role.id, Role.name, Role.description).all()
        return [row._asdict() for row in rows]

    def get_by_id(self, id):
        return self.session.query(Role.id, Role.name, Role.description).filter(Role.id == id).first()

    def get_by_name(self, name):
        return self.session.query(Role).filter(Role.name == name).first()

    def create(self, role):
        self.session.add(role)
        self.session.commit()
        return role

    def update(self, role):
        self.session.merge(role)
        self.session.commit()
        return role

    def delete(self, role):
        self.session.delete(role)
        self.session.commit()
        return role