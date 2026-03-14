from src.modules.userManagement.services.user_service import UserService
from fastapi import APIRouter, Request

user_router = APIRouter(prefix="/user", tags=["userManagement"])

@user_router.get("/list")
async def user_list():
    service = UserService()
    return service.list()

@user_router.post("/create")
async def user_create(request: Request):
    service = UserService()
    return service.create(request)

@user_router.post("/update")
async def user_update(request: Request):
    service = UserService()
    return service.update(request)
