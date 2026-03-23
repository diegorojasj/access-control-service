from fastapi import Depends
from src.modules.auth.services.session_service import SessionService
from src.modules.userManagement.services.user_service import UserService
from fastapi import APIRouter, Request

user_router = APIRouter(prefix="/user", tags=["userManagement"])

@user_router.get("/list", tags=["user_list"], dependencies=[Depends(SessionService().isLoggedIn)])
async def user_list():
    service = UserService()
    return service.list()

@user_router.post("/create", tags=["user_create"], dependencies=[Depends(SessionService().isLoggedIn)])
async def user_create(request: Request):
    service = UserService()
    return await service.create(request)

@user_router.post("/update", tags=["user_update"], dependencies=[Depends(SessionService().isLoggedIn)])
async def user_update(request: Request):
    service = UserService()
    return await service.update(request)

@user_router.post("/status-change", tags=["user_status_change"], dependencies=[Depends(SessionService().isLoggedIn)])
async def user_status_change(request: Request):
    service = UserService()
    return await service.status_change(request)
