from typing import Literal
from fastapi import Response

from src.modules.auth.infrastructure.entities.user_entity import User

class SessionRepository:
    def __init__(self, session):
        self.session = session

    def verifyLogin(self, username: str, password: str):
        return self.session.query(User).filter(User.username == username, User.password == password).first()

        
