from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from src.core.exceptions.authException import AuthException


async def auth_exception_handler(request: Request, exc: AuthException) -> JSONResponse:
    if isinstance(exc.detail, dict):
        content = exc.detail.get("detail", exc.detail)
    else:
        content = exc.detail

    response = JSONResponse(status_code=exc.status_code, content=content)

    response.delete_cookie(key="token")
    response.delete_cookie(key="expire_at")
    return response


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AuthException, auth_exception_handler)  # type: ignore[arg-type]
