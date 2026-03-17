from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from src.core.database import get_db
from src.modules.roleManagement.infrastructure.repositories.role_repository import RoleRepository
from src.modules.permissions.infrastructure.repositories.permission_repository import PermissionRepository
from src.modules.roleManagement.infrastructure.entities.role_entity import Role
from src.modules.permissions.infrastructure.entities.permission_entity import Permission

router = APIRouter()

roles_router = APIRouter(prefix="/roles", tags=["roles"])
permissions_router = APIRouter(prefix="/permissions", tags=["permissions"])


# --- Schemas ---

class RoleCreate(BaseModel):
    name: str
    description: Optional[str] = None


class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class PermissionCreate(BaseModel):
    name: str
    description: Optional[str] = None


# --- Roles ---

@roles_router.get("")
def get_roles(db: Session = Depends(get_db)):
    return RoleRepository(db).get_all()


@roles_router.post("", status_code=201)
def create_role(body: RoleCreate, db: Session = Depends(get_db)):
    repo = RoleRepository(db)
    if repo.get_by_name(body.name):
        raise HTTPException(status_code=409, detail="Role already exists")
    return repo.create(Role(name=body.name, description=body.description))


@roles_router.patch("/{id}")
def update_role(id: int, body: RoleUpdate, db: Session = Depends(get_db)):
    repo = RoleRepository(db)
    role = repo.get_by_id(id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    if body.name is not None:
        role.name = body.name
    if body.description is not None:
        role.description = body.description
    return repo.update(role)


@roles_router.delete("/{id}", status_code=204)
def delete_role(id: int, db: Session = Depends(get_db)):
    repo = RoleRepository(db)
    role = repo.get_by_id(id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    repo.delete(role)


# --- Permissions ---

@permissions_router.get("")
def get_permissions(db: Session = Depends(get_db)):
    return PermissionRepository(db).get_all()


@permissions_router.post("", status_code=201)
def create_permission(body: PermissionCreate, db: Session = Depends(get_db)):
    repo = PermissionRepository(db)
    if repo.get_by_name(body.name):
        raise HTTPException(status_code=409, detail="Permission already exists")
    return repo.create(Permission(name=body.name, description=body.description))


@permissions_router.delete("/{name}", status_code=204)
def delete_permission(name: str, db: Session = Depends(get_db)):
    repo = PermissionRepository(db)
    permission = repo.get_by_name(name)
    if not permission:
        raise HTTPException(status_code=404, detail="Permission not found")
    repo.delete(permission)


router.include_router(roles_router)
router.include_router(permissions_router)
