from src.shared.utils import getExpiredAt
from src.shared.utils import generate_token_by_user
from src.shared.utils import setCookie
from src.modules.auth.infrastructure.types.session_types import login_requestType
from src.core.exceptions.authException import AuthException
from fastapi import Request, Response
from src.core.database import Session
from src.modules.auth.infrastructure.repositories.session_repository import SessionRepository


class SessionService:
    async def login(self, request: Request, response: Response):
        json_data = await request.json()
        data = login_requestType(**json_data)
        with Session() as session:
            sessionRepository = SessionRepository(session)
            user = sessionRepository.verifyLogin(data.username, data.password)
            if user is None:
                raise AuthException(
                    status_code=401, 
                    detail={"message": "Invalid credentials", "error": "INVALID_CREDENTIALS"}
                )

            expire_at = getExpiredAt()
            token = generate_token_by_user(user)
            setCookie("token", token, response)
            setCookie("expire_at", expire_at.strftime("%a, %d-%b-%Y %H:%M:%S GMT"), response)
            setCookie("user", user.username, response, httponly=False)
            setCookie("role", user.role.name, response, httponly=False)
            return {"message": "Login successful"}
