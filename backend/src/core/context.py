# context.py - Create a new file for context management
from contextvars import ContextVar
from typing import Optional

current_user_id: ContextVar[Optional[str]] = ContextVar("current_user_id", default=None)
current_username: ContextVar[Optional[str]] = ContextVar("current_username", default=None)

def set_current_user_id(user_id: str):
    current_user_id.set(user_id)

def get_current_user_id() -> Optional[str]:
    return current_user_id.get()

def set_current_username(username: str):
    current_username.set(username)

def get_current_username() -> Optional[str]:
    return current_username.get()