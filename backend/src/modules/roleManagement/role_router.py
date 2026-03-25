from src.modules.roleManagement.services.role_permission_service import RolePermissionService
from fastapi import Depends
from src.modules.auth.services.session_service import SessionService
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
    service = RolePermissionService()
    return service.list(role_id)

@role_router.post("/permissions", tags=["role_permissions_assign"], dependencies=[Depends(SessionService().isLoggedIn)])
async def role_permissions_assign(request: Request):
    service = RolePermissionService()
    return await service.assign(request)

@role_router.delete("/permissions", tags=["role_permissions_remove"], dependencies=[Depends(SessionService().isLoggedIn)])
async def role_permissions_remove(request: Request):
    service = RolePermissionService()
    return await service.remove(request)
