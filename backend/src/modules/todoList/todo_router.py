from src.core.permissionsControl import PermissionControl
from fastapi import Depends
from src.modules.todoList.services.todo_service import TodoService
from fastapi import APIRouter, Request

todo_router = APIRouter(prefix="/todo", tags=["todoList"])
permissionControl = PermissionControl()

@todo_router.get("/list", tags=["todo_list"], dependencies=[Depends(permissionControl.requirePermission("todo:view"))])
async def todo_list():
    service = TodoService()
    return service.list()

@todo_router.post("/create", tags=["todo_create"], dependencies=[Depends(permissionControl.requirePermission("todo:create"))])
async def todo_create(request: Request):
    service = TodoService()
    return await service.create(request)

@todo_router.post("/update", tags=["todo_update"], dependencies=[Depends(permissionControl.requirePermission("todo:update"))])
async def todo_update(request: Request):
    service = TodoService()
    return await service.update(request)

@todo_router.post("/update-order", tags=["todo_update_order"], dependencies=[Depends(permissionControl.requirePermission("todo:update"))])
async def todo_update_order(request: Request):
    service = TodoService()
    return await service.update_order(request)

@todo_router.post("/status-change", tags=["todo_status_change"], dependencies=[Depends(permissionControl.requirePermission("todo:update"))])
async def todo_status_change(request: Request):
    service = TodoService()
    return await service.status_change(request)

@todo_router.post("/delete", tags=["todo_delete"], dependencies=[Depends(permissionControl.requirePermission("todo:delete"))])
async def todo_delete(request: Request):
    service = TodoService()
    return await service.delete(request)
