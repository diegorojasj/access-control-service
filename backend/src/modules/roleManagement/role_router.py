from fastapi import Depends
from src.modules.auth.services.session_service import SessionService
from src.modules.roleManagement.services.role_service import RoleService
from fastapi import APIRouter, Request

role_router = APIRouter(prefix="/role", tags=["roleManagement"])

@role_router.get("/list", tags=["role_list"], dependencies=[Depends(SessionService().isLoggedIn)])
async def role_list():
    service = RoleService()
    return service.list()

@role_router.post("/create", tags=["role_create"], dependencies=[Depends(SessionService().isLoggedIn)])
async def role_create(request: Request):
    service = RoleService()
    return await service.create(request)

@role_router.post("/update", tags=["role_update"], dependencies=[Depends(SessionService().isLoggedIn)])
async def role_update(request: Request):
    service = RoleService()
    return await service.update(request)

@role_router.post("/delete", tags=["role_delete"], dependencies=[Depends(SessionService().isLoggedIn)])
async def role_delete(request: Request):
    service = RoleService()
    return await service.delete(request)