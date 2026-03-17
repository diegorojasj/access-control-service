from src.modules.userManagement.infrastructure.types.user_types import delete_requestType
from src.modules.userManagement.infrastructure.types.user_types import update_requestType
from src.modules.userManagement.infrastructure.types.user_types import create_requestType
from src.modules.auth.infrastructure.entities.user_entity import User
from src.modules.userManagement.infrastructure.repositories.user_repository import UserRepository
from src.shared.utils import passwordHash
from src.core.database import Session

class UserService:
    def list(self):
        with Session() as session:
            userRepository = UserRepository(session)
            userList = userRepository.get_all()
            return userList

    async def create(self, request):
        json_data = await request.json()
        data = create_requestType(**json_data)
        with Session() as session:
            userRepository = UserRepository(session)
            user = User(
                name=data.name,
                username=data.username,
                password=passwordHash(data.password),
                _role=data.role
            )
            userRepository.create(user)
            return {"message": "User created successfully"}

    async def update(self, request):
        json_data = await request.json()
        data = update_requestType(**json_data)
        with Session() as session:
            userRepository = UserRepository(session)
            user = User(
                id=data.id,
                name=data.name,
                username=data.username,
                password=passwordHash(data.password),
                _role=data.role
            )
            userRepository.update(user)
            return {"message": "User updated successfully"}

    async def delete(self, request):
        json_data = await request.json()
        data = delete_requestType(**json_data)
        with Session() as session:
            userRepository = UserRepository(session)
            user = userRepository.get_by_id(data.id)
            userRepository.delete(user)
            return {"message": "User deleted successfully"}