import { memo } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import type { UserType } from "@/userManagement/infrastructure/userType.infrastructure"
import { Button } from "@/components/ui/button"

const UserTableRow = memo(({ user, onEdit, onStatusChange, editPermission, suspendPermission, unsuspendPermission } : { user: UserType, onEdit: (user: UserType) => void, onStatusChange: (user: UserType) => void, editPermission: boolean, suspendPermission: boolean, unsuspendPermission: boolean }) => {
    const isSuspend = user.status == 1
    return <TableRow key={user.id}>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell>{isSuspend ? "Active" : "Inactive"}</TableCell>
        <TableCell className="flex gap-2" >
            {editPermission && <Button
                className="bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                size="sm"
                variant="secondary"
                onClick={() => onEdit(user)}>
                Edit
            </Button>}
            {((suspendPermission && !isSuspend) || (unsuspendPermission && isSuspend)) && <Button
                className={isSuspend
                    ? "bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    : "bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                }
                size="sm"
                variant="secondary"
                onClick={() => onStatusChange(user)}
            >
                {isSuspend ? "Suspend" : "Activate"}
            </Button>}
        </TableCell>
    </TableRow>
})

export default UserTableRow