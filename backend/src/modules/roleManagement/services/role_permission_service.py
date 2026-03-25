from src.modules.roleManagement.infrastructure.types.role_types import permission_requestType, onlyId_requestType
from src.modules.roleManagement.infrastructure.repositories.role_repository import RoleRepository
from src.modules.roleManagement.infrastructure.repositories.role_permission_repository import RolePermissionRepository
from src.modules.permissions.infrastructure.repositories.permission_repository import PermissionRepository
from src.core.database import Session
from fastapi import HTTPException

class RolePermissionService:
    def list(self, role_id: int):
        with Session() as session:
            role = RoleRepository(session).get_by_id(role_id)
            if role is None:
                raise HTTPException(status_code=404, detail="Role not found")
            return RolePermissionRepository(session).get_permissions(role)

    async def assign(self, request):
        json_data = await request.json()
        data = permission_requestType(**json_data)
        with Session() as session:
            role = RoleRepository(session).get_by_id(data.role_id)
            if role is None:
                raise HTTPException(status_code=404, detail="Role not found")
            permission = PermissionRepository(session).get_by_name(data.permission_name)
            if permission is None:
                raise HTTPException(status_code=404, detail="Permission not found")
            if permission in role.permissions:
                raise HTTPException(status_code=400, detail="Permission already assigned to role")
            RolePermissionRepository(session).assign(role, permission)
            return {"message": "Permission assigned successfully"}

    async def remove(self, request):
        json_data = await request.json()
        data = permission_requestType(**json_data)
        with Session() as session:
            role = RoleRepository(session).get_by_id(data.role_id)
            if role is None:
                raise HTTPException(status_code=404, detail="Role not found")
            permission = PermissionRepository(session).get_by_name(data.permission_name)
            if permission is None:
                raise HTTPException(status_code=404, detail="Permission not found")
            if permission not in role.permissions:
                raise HTTPException(status_code=400, detail="Permission not assigned to role")
            RolePermissionRepository(session).remove(role, permission)
            return {"message": "Permission removed successfully"}
