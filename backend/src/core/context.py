# context.py - Create a new file for context management
from contextvars import ContextVar
from typing import List, Optional

# Create context variable for user ID
current_user_id: ContextVar[Optional[str]] = ContextVar("current_user_id", default=None)

def set_current_user_id(user_id: str):
    """Set the current user ID in context"""
    current_user_id.set(user_id)


def get_current_user_id() -> Optional[str]:
    """Get the current user ID from context"""
    return current_user_id.get()