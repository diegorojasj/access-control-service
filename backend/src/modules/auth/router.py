from src.modules.auth.services.user_service import UserService
from src.modules.auth.services.session_service import SessionService
from src.core.exceptions.authException import AuthException
from src.security.token import verify_token
from fastapi import APIRouter, Request, Response, Cookie
from typing import Optional

session_router = APIRouter(prefix="/auth", tags=["auth_session"])
user_router = APIRouter(prefix="/user", tags=["auth_user"])

@session_router.post("/login")
async def login(request: Request, response: Response):
    service = SessionService()
    return await service.login(request, response)


@session_router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="token")
    response.delete_cookie(key="expire_at")
    response.delete_cookie(key="user")
    response.delete_cookie(key="role")
    return {"message": "Logged out"}


@session_router.get("/verify")
def verify(token: Optional[str] = Cookie(default=None)):
    if not token:
        raise AuthException(status_code=401, detail="Not authenticated")

    payload = verify_token(token)
    if not payload:
        raise AuthException(status_code=401, detail="Invalid or expired token")

    return {"id": payload.get("sub"), "role": payload.get("role")}


@user_router.get("/list")
async def user_list():
    service = UserService()
    return service.list()