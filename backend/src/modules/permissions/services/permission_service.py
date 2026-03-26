from src.core.permissionsControl import PermissionControl

class PermissionService:
    def list(self):
        permissionControl = PermissionControl()
        return [permissionControl.encodePermission(permission) for permission in permissionControl.getPermissions()]
