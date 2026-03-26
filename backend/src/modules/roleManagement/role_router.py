from src.modules.roleManagement.services.role_service import RoleService
from fastapi import APIRouter, Request

role_router = APIRouter(prefix="/role", tags=["roleManagement"])

@role_router.get("", tags=["role_list"], dependencies=[Depends(SessionService().isLoggedIn)])
async def role_list():
    service = RoleService()
    return service.list()

@role_router.post("", tags=["role_create"], dependencies=[Depends(SessionService().isLoggedIn)])
async def role_create(request: Request):
    service = RoleService()
    return await service.create(request)

@role_router.put("", tags=["role_update"], dependencies=[Depends(SessionService().isLoggedIn)])
async def role_update(request: Request):
    service = RoleService()
    return await service.update(request)

@role_router.delete("", tags=["role_delete"], dependencies=[Depends(SessionService().isLoggedIn)])
async def role_delete(request: Request):
    service = RoleService()
    return await service.delete(request)

@role_router.get("/{role_id}/permissions", tags=["role_permissions_list"], dependencies=[Depends(SessionService().isLoggedIn)])
async def role_permissions_list(role_id: int):
    service = RoleService()
    return service.list_permissions(role_id)