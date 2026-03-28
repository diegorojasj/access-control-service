import asyncio
import json
from collections.abc import AsyncIterable
from fastapi import Request
from fastapi.sse import ServerSentEvent
from src.core.context import get_current_user_id
from src.core.database import Session
from src.core.permissionsControl import PermissionControl
from src.modules.userManagement.infrastructure.repositories.user_repository import UserRepository


class EventsService:
    async def stream(self, request: Request) -> AsyncIterable[ServerSentEvent]:
        last_permissions: list[str] | None = None
        pc = PermissionControl()

        try:
            while not await request.is_disconnected():
                user_id = get_current_user_id()
                if not user_id:
                    yield ServerSentEvent(raw_data="Not authenticated", event="logout")
                    return

                with Session() as session:
                    user = UserRepository(session).get_by_id(int(user_id))
                    if user is None or user.status == 0:
                        yield ServerSentEvent(raw_data="User suspended", event="logout")
                        return
                    permissions: list[str] = list(user.role.permissions or [])

                if permissions != last_permissions:
                    last_permissions = permissions
                    encoded = [pc.encodePermission(p) for p in permissions]
                    yield ServerSentEvent(raw_data=json.dumps(encoded), event="permissions")

                await asyncio.sleep(3)
        except asyncio.CancelledError:
            return
