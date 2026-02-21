"""AuthException module."""

from fastapi import HTTPException


class AuthException(HTTPException):
    """Custom exception for auth-related errors that require cookie deletion."""

    pass
