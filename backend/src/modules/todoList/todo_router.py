from src.modules.todoList.services.todo_service import TodoService
from fastapi import APIRouter, Request

todo_router = APIRouter(prefix="/todo", tags=["todoList"])

@todo_router.get("/list", tags=["todo_list"])
async def todo_list():
    service = TodoService()
    return service.list()

@todo_router.post("/create", tags=["todo_create"])
async def todo_create(request: Request):
    service = TodoService()
    return await service.create(request)

@todo_router.post("/update", tags=["todo_update"])
async def todo_update(request: Request):
    service = TodoService()
    return await service.update(request)

@todo_router.post("/update-order", tags=["todo_update_order"])
async def todo_update_order(request: Request):
    service = TodoService()
    return await service.update_order(request)

@todo_router.post("/status-change", tags=["todo_status_change"])
async def todo_status_change(request: Request):
    service = TodoService()
    return await service.status_change(request)

@todo_router.post("/delete", tags=["todo_delete"])
async def todo_delete(request: Request):
    service = TodoService()
    return await service.delete(request)
