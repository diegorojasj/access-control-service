from src.modules.userManagement.services.user_service import UserService
from src.modules.auth.services.session_service import SessionService
from fastapi import APIRouter, Request, Response

session_router = APIRouter(prefix="/auth", tags=["auth_session"])

@session_router.post("/login", tags=["auth_login"])
async def login(request: Request, response: Response):
    service = SessionService()
    return await service.login(request, response)


@session_router.post("/logout", tags=["auth_logout"])
def logout(response: Response):
    response.delete_cookie(key="token")
    response.delete_cookie(key="expire_at")
    response.delete_cookie(key="user")
    response.delete_cookie(key="role")
    return {"message": "Logged out"}