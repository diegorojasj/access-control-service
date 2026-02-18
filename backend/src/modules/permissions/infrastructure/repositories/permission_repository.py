from src.modules.permissions.infrastructure.entities.permission_entity import Permission

class PermissionRepository:
    def __init__(self, session):
        self.session = session

    def get_all(self):
        return self.session.query(Permission).all()

    def get_by_name(self, name):
        return self.session.query(Permission).filter(Permission.name == name).first()

    def create(self, permission):
        self.session.add(permission)
        self.session.commit()
        return permission

    def update(self, permission):
        self.session.merge(permission)
        self.session.commit()
        return permission

    def delete(self, permission):
        self.session.delete(permission)
        self.session.commit()
        return permission