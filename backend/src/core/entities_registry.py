# pyrefly: ignore[unused-import]
from src.core.database import engine
from src.shared.baseModel import Base

# Import all entities so they register with Base.metadata before create_all
import src.modules.auth.infrastructure.entities.user_entity
import src.modules.roleManagement.infrastructure.entities.role_entity
import src.modules.permissions.infrastructure.entities.permission_entity
import src.modules.todoList.infrastructure.entities.todo_entity

def register_entities():
    Base.metadata.create_all(bind=engine)