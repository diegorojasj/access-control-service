from src.modules.permissions.services.permission_service import PermissionService
from fastapi import APIRouter

permission_router = APIRouter(prefix="/permission", tags=["permissionManagement"])

@permission_router.get("", tags=["permission_list"])
async def permission_list():
    service = PermissionService()
    return service.list()
