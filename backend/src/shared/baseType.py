"""baseType module."""

from dataclasses import MISSING, dataclass, fields
from typing import Union, get_args, get_origin, get_type_hints


@dataclass
class baseType:
    def __post_init__(self):
        """Post initialization validation."""
        # Get type hints to check for Optional fields
        type_hints = get_type_hints(self.__class__)

        # Iterate through dataclass fields
        for f in fields(self.__class__):
            value = getattr(self, f.name)

            # Check if field is Optional (Union[T, None])
            field_type = type_hints.get(f.name)
            is_optional = self._is_optional(field_type)

            # Skip validation for Optional fields if value is None
            if is_optional and value is None:
                continue

            # Skip validation if field has a default value and current value matches default
            if f.default is not MISSING and value == f.default:
                continue
            if f.default_factory is not MISSING and value == f.default_factory():
                continue

            # Validate required fields
            if not is_optional:
                if value is None:
                    raise ValueError(f"Field '{f.name}' is required and cannot be None")

                # Validate string fields are not empty
                if isinstance(value, str) and not value.strip():
                    raise ValueError(f"Field '{f.name}' cannot be an empty string")

    @staticmethod
    def _is_optional(field_type) -> bool:
        """Check if a type hint represents an Optional type (Union[T, None])"""
        if field_type is None:
            return False

        # Check if it's a Union type
        origin = get_origin(field_type)
        if origin is Union:
            args = get_args(field_type)
            # Optional[T] is Union[T, None]
            return type(None) in args

        return False
