from src.shared.utils import passwordVerify
from fastapi import HTTPException
from src.modules.userManagement.infrastructure.types.user_types import onlyId_requestType
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
        with Session.begin() as session:
            userRepository = UserRepository(session)
            user = userRepository.get_by_username(data.username)
            if user:
                raise HTTPException(status_code=400, detail="User already exists")
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
        with Session.begin() as session:
            userRepository = UserRepository(session)
            userVerification = userRepository.get_by_username(data.username)
            if userVerification is not None and userVerification.id != data.id:
                raise HTTPException(status_code=400, detail="Username already exists")
            user = userRepository.get_by_username(data.username)
            if user:
                raise HTTPException(status_code=400, detail="User already exists")
            user = userRepository.get_by_id(data.id)
            if user is None:
                raise HTTPException(status_code=404, detail="User not found")
            user.name = data.name
            user.username = data.username
            user._role = data.role
            if data.password and data.password != "":
                if not data.current_password:
                    raise HTTPException(status_code=400, detail="The current password is required")
                if not passwordVerify(data.current_password, user.password):
                    raise HTTPException(status_code=400, detail="Invalid current password")
                user.password = passwordHash(data.password)
            userRepository.update(user)
            return {"message": "User updated successfully"}

    async def status_change(self, request):
        json_data = await request.json()
        data = onlyId_requestType(**json_data)
        with Session.begin() as session:
            userRepository = UserRepository(session)
            user = userRepository.get_by_id(data.id)
            user.status = 0 if user.status == 1 else 1
            userRepository.update(user)
            return {"message": "User status changed successfully"}