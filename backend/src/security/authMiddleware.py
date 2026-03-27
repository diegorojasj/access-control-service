from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from src.core.context import set_current_user_id, set_current_username
from src.modules.userManagement.infrastructure.repositories.user_repository import UserRepository
from src.security.token import verify_token
from src.core.database import Session

PUBLIC_PATHS = {"/auth/login", "/auth/logout", "/health"}


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path in PUBLIC_PATHS:
            return await call_next(request)

        token = request.cookies.get("token")
        if not token:
            return self._unauthorized("Not authenticated")

        payload = verify_token(token)
        if not payload:
            return self._unauthorized("Invalid or expired token")

        user_id = payload.get("sub")
        if user_id is None:
            return self._unauthorized("Invalid token payload")

        with Session() as session:
            user = UserRepository(session).get_by_id(int(user_id))
            if user is None or user.status == 0:
                return self._unauthorized("User is suspended")

        set_current_user_id(str(payload.get("sub")))
        set_current_username(str(payload.get("username", "")))
        return await call_next(request)

    def _unauthorized(self, detail: str) -> JSONResponse:
        response = JSONResponse(status_code=401, content=detail)
        response.delete_cookie("token")
        response.delete_cookie("expire_at")
        response.delete_cookie("user")
        response.delete_cookie("role")
        return response
