from src.shared.utils import passwordVerify
from sqlalchemy.orm import Session

from src.modules.auth.infrastructure.entities.user_entity import User

class SessionRepository:
    def __init__(self, session: Session):
        self.session = session

    def verifyLogin(self, username: str, password: str) -> User | None:
        user = self.session.query(User).filter(User.username == username).first()
        if user is None or not passwordVerify(password, user.password):
            return None
        return user
