from src.modules.roleManagement.services.role_service import RoleService
from fastapi import APIRouter, Request

role_router = APIRouter(prefix="/role", tags=["roleManagement"])

@role_router.get("/list")
async def role_list():
    service = RoleService()
    return service.list()

@role_router.post("/create")
async def role_create(request: Request):
    service = RoleService()
    return service.create(request)

@role_router.post("/update")
async def role_update(request: Request):
    service = RoleService()
    return service.update(request)