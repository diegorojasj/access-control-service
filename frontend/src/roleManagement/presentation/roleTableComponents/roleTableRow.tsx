import { memo } from "react"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import type { RoleType } from "@/roleManagement/infrastructure/roleType.infrastructure"

const RoleTableRow = memo(({ role, onDelete, onEdit, editPermission, deletePermission } : { role: RoleType, onDelete: (role: RoleType) => void, onEdit: (role: RoleType) => void, editPermission: boolean, deletePermission: boolean }) => {
    return <TableRow key={role.id}>
        <TableCell>{role.name}</TableCell>
        <TableCell><div className="max-w-[200px] whitespace-normal break-words">{role.description}</div></TableCell>
        <TableCell className="flex gap-2">
            {editPermission && !role.is_immutable && <Button
                className="bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                size="sm"
                variant="secondary"
                onClick={() => onEdit(role)}
            >
                Edit
            </Button>}
            {deletePermission && !role.is_immutable && <Button
                className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                size="sm"
                variant="secondary"
                onClick={() => onDelete(role)}
            >
                Delete
            </Button>}
        </TableCell>
    </TableRow>
})

export default RoleTableRow