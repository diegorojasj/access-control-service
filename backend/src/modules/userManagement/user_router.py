from src.core.permissionsControl import PermissionControl
from src.modules.userManagement.services.user_service import UserService
from fastapi import APIRouter, Request, Depends

user_router = APIRouter(prefix="/user", tags=["userManagement"])
permissionControl = PermissionControl()

@user_router.get("", tags=["user_list"], dependencies=[Depends(permissionControl.requirePermission("user:view"))])
async def user_list():
    service = UserService()
    return service.list()

@user_router.post("", tags=["user_create"], dependencies=[Depends(permissionControl.requirePermission("user:create"))])
async def user_create(request: Request):
    service = UserService()
    return await service.create(request)

@user_router.put("", tags=["user_update"], dependencies=[Depends(permissionControl.requirePermission("user:update"))])
async def user_update(request: Request):
    service = UserService()
    return await service.update(request)

@user_router.patch("/status", tags=["user_status_change"])
async def user_status_change(request: Request):
    service = UserService()
    return await service.status_change(request)
