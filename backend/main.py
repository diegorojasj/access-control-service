from src.shared.utils import passwordHash
from src.modules.auth.router import session_router, user_router
from src.core.entities_registry import register_entities
from src.core.handlers import register_exception_handlers
from src.modules.permissions.router import router as permissions_router

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
app.include_router(permissions_router)

@app.get("/health")
def read_root():
    return {"status": "ok"}