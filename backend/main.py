from src.modules.todoList.todo_router import todo_router
from src.modules.auth.auth_router import session_router
from src.modules.userManagement.user_router import user_router
from src.modules.roleManagement.role_router import role_router
from src.core.entities_registry import register_entities
from src.core.handlers import register_exception_handlers
from src.modules.permissions.permission_router import permission_router

from contextlib import asynccontextmanager
from fastapi import FastAPI

# Lifespan handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Application startup")
    register_entities()
    yield
    print("Application shutdown")

app = FastAPI(lifespan=lifespan)
register_exception_handlers(app)

app.include_router(session_router)
app.include_router(user_router)
app.include_router(role_router)
app.include_router(permission_router)
app.include_router(todo_router)

@app.get("/health")
def read_root():
    return {"status": "ok"}