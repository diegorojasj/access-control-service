from fastapi import Depends
from src.modules.auth.services.session_service import SessionService
from src.modules.todoList.services.todo_service import TodoService
from fastapi import APIRouter, Request

todo_router = APIRouter(prefix="/todo", tags=["todoList"])

@todo_router.get("/list", tags=["todo_list"], dependencies=[Depends(SessionService().isLoggedIn)])
async def todo_list():
    service = TodoService()
    return service.list()

@todo_router.post("/create", tags=["todo_create"], dependencies=[Depends(SessionService().isLoggedIn)])
async def todo_create(request: Request):
    service = TodoService()
    return await service.create(request)

@todo_router.post("/update", tags=["todo_update"], dependencies=[Depends(SessionService().isLoggedIn)])
async def todo_update(request: Request):
    service = TodoService()
    return await service.update(request)

@todo_router.post("/update-order", tags=["todo_update_order"], dependencies=[Depends(SessionService().isLoggedIn)])
async def todo_update_order(request: Request):
    service = TodoService()
    return await service.update_order(request)

@todo_router.post("/status-change", tags=["todo_status_change"], dependencies=[Depends(SessionService().isLoggedIn)])
async def todo_status_change(request: Request):
    service = TodoService()
    return await service.status_change(request)

@todo_router.post("/delete", tags=["todo_delete"], dependencies=[Depends(SessionService().isLoggedIn)])
async def todo_delete(request: Request):
    service = TodoService()
    return await service.delete(request)
