from src.modules.roleManagement.infrastructure.entities.role_entity import Role
from src.modules.permissions.infrastructure.entities.permission_entity import Permission

class RolePermissionRepository:
    def __init__(self, session):
        self.session = session

    def get_permissions(self, role: Role):
        return [{"name": p.name, "description": p.description} for p in role.permissions]

    def assign(self, role: Role, permission: Permission):
        role.permissions.append(permission)
        self.session.commit()

    def remove(self, role: Role, permission: Permission):
        role.permissions.remove(permission)
        self.session.commit()
