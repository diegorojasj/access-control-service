from src.modules.roleManagement.infrastructure.types.role_types import update_requestType
from src.modules.roleManagement.infrastructure.entities.role_entity import Role
from src.modules.roleManagement.infrastructure.types.role_types import create_requestType
from src.core.database import Session
from src.modules.roleManagement.infrastructure.repositories.role_repository import RoleRepository

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
            role = Role(
                id=data.id,
                name=data.name,
                description=data.description
            )
            roleRepository.update(role)
            return {"message": "Role updated successfully"}