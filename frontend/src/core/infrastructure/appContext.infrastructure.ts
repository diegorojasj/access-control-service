import type { AuthType } from "@/auth/infrastructure/authType.infrastructure"

export interface AppContextType {
    user: AuthType | null
    setUser: (user: AuthType | null) => void
    permissions: string[]
    setPermissions: (permissions: string[]) => void
    requirePermission: (permission: string | string[]) => boolean
    // To Do List
    openToDoListForm: boolean
    setOpenToDoListForm: (bool: boolean) => void
    openToDoListTable: boolean
    setOpenToDoListTable: (bool: boolean) => void
    // User Management
    openUserManagementForm: boolean
    setOpenUserManagementForm: (bool: boolean) => void
    openUserManagementTable: boolean
    setOpenUserManagementTable: (bool: boolean) => void
    // Role Management
    openRoleManagementForm: boolean
    setOpenRoleManagementForm: (bool: boolean) => void
    openRoleManagementTable: boolean
    setOpenRoleManagementTable: (bool: boolean) => void
    reset: () => void
}