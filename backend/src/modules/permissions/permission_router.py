from fastapi import Depends
from src.modules.auth.services.session_service import SessionService
from src.modules.permissions.services.permission_service import PermissionService
from fastapi import APIRouter, Request

permission_router = APIRouter(prefix="/permission", tags=["permissionManagement"])

@permission_router.get("", tags=["permission_list"], dependencies=[Depends(SessionService().isLoggedIn)])
async def permission_list():
    service = PermissionService()
    return service.list()

@permission_router.post("", tags=["permission_create"], dependencies=[Depends(SessionService().isLoggedIn)])
async def permission_create(request: Request):
    service = PermissionService()
    return await service.create(request)

@permission_router.put("", tags=["permission_update"], dependencies=[Depends(SessionService().isLoggedIn)])
async def permission_update(request: Request):
    service = PermissionService()
    return await service.update(request)

@permission_router.delete("", tags=["permission_delete"], dependencies=[Depends(SessionService().isLoggedIn)])
async def permission_delete(request: Request):
    service = PermissionService()
    return await service.delete(request)
