from src.modules.permissions.infrastructure.types.permission_types import create_requestType, update_requestType, onlyName_requestType
from src.modules.permissions.infrastructure.entities.permission_entity import Permission
from src.modules.permissions.infrastructure.repositories.permission_repository import PermissionRepository
from src.core.database import Session
from fastapi import HTTPException

class PermissionService:
    def list(self):
        with Session() as session:
            permissionRepository = PermissionRepository(session)
            return permissionRepository.get_all()

    async def create(self, request):
        json_data = await request.json()
        data = create_requestType(**json_data)
        with Session() as session:
            permissionRepository = PermissionRepository(session)
            permission = permissionRepository.get_by_name(data.name)
            if permission:
                raise HTTPException(status_code=400, detail="Permission already exists")
            permission = Permission(
                name=data.name,
                description=data.description,
            )
            permissionRepository.create(permission)
            return {"message": "Permission created successfully"}

    async def update(self, request):
        json_data = await request.json()
        data = update_requestType(**json_data)
        with Session() as session:
            permissionRepository = PermissionRepository(session)
            permission = permissionRepository.get_by_name(data.name)
            if permission is None:
                raise HTTPException(status_code=404, detail="Permission not found")
            permission.description = data.description
            permissionRepository.update(permission)
            return {"message": "Permission updated successfully"}

    async def delete(self, request):
        json_data = await request.json()
        data = onlyName_requestType(**json_data)
        with Session() as session:
            permissionRepository = PermissionRepository(session)
            permission = permissionRepository.get_by_name(data.name)
            if permission is None:
                raise HTTPException(status_code=404, detail="Permission not found")
            permissionRepository.delete(permission)
            return {"message": "Permission deleted successfully"}
