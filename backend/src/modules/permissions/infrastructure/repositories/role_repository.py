from src.modules.permissions.infrastructure.entities.role_entity import Role

class RoleRepository:
    def __init__(self, session):
        self.session = session

    def get_all(self):
        return self.session.query(Role).all()

    def get_by_id(self, id):
        return self.session.query(Role).filter(Role.id == id).first()

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