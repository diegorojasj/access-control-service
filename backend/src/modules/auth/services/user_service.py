from src.modules.auth.infrastructure.repositories.user_repository import UserRepository
from src.core.database import Session

class UserService:
    def list(self):
        with Session() as session:
            userRepository = UserRepository(session)
            userList = userRepository.get_all()
            return userList
