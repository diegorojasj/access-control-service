from src.modules.userManagement.infrastructure.repositories.user_repository import UserRepository
from src.modules.roleManagement.infrastructure.types.role_types import onlyId_requestType, update_requestType
from src.modules.roleManagement.infrastructure.entities.role_entity import Role
from src.modules.roleManagement.infrastructure.types.role_types import create_requestType
from src.core.database import Session
from src.modules.roleManagement.infrastructure.repositories.role_repository import RoleRepository
from fastapi import HTTPException

class RoleService:
    def list(self):
        with Session() as session:
            roleRepository = RoleRepository(session)
            roleList = roleRepository.get_all()
            return roleList

    async def create(self, request):
        json_data = await request.json()
        data = create_requestType(**json_data)
        with Session() as session:
            roleRepository = RoleRepository(session)
            role = roleRepository.get_by_name(data.name)
            if role:
                raise HTTPException(status_code=400, detail="Role already exists")
            role = Role(
                name=data.name,
                description=data.description
            )
            roleRepository.create(role)
            return {"message": "Role created successfully"}

    async def update(self, request):
        json_data = await request.json()
        data = update_requestType(**json_data)
        with Session() as session:
            roleRepository = RoleRepository(session)
            role = roleRepository.get_by_name(data.name)
            if role:
                raise HTTPException(status_code=400, detail="Role already exists")
            role = roleRepository.get_by_id(data.id)
            if role is None:
                raise HTTPException(status_code=404, detail="Role not found")
            if role.is_immutable:
                raise HTTPException(status_code=400, detail="Role is immutable")
            role.name = data.name
            role.description = data.description
            roleRepository.update(role)
            return {"message": "Role updated successfully"}

    async def delete(self, request):
        json_data = await request.json()
        data = onlyId_requestType(**json_data)
        with Session() as session:
            roleRepository = RoleRepository(session)
            role = roleRepository.get_by_id(data.id)
            if role is None:
                raise HTTPException(status_code=404, detail="Role not found")
            if role.is_immutable:
                raise HTTPException(status_code=400, detail="Role is immutable")
            userRepository = UserRepository(session)
            users = userRepository.get_by_role(role.name)
            if users:
                raise HTTPException(status_code=400, detail="Role is assigned to users")
            roleRepository.delete(role)
            return {"message": "Role deleted successfully"}