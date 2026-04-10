import { ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCaption } from "@/components/ui/table"
import { useAutoRequest, useMutateRequest } from "@/shared/useRequest"
import type { RoleType } from "@/roleManagement/infrastructure/roleType.infrastructure"
import { sileo } from "sileo"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import RoleForm from "@/roleManagement/presentation/roleForm.presentation"
import { AppStore } from "@/core/AppContext"
import RoleTableColumns from "@/roleManagement/presentation/roleTableComponents/roleTableColumns"
import RoleTableRow from "@/roleManagement/presentation/roleTableComponents/roleTableRow"

const RoleTable = () => {
    const { permissions, requirePermission } = AppStore()
    const [editRole, setEditRole] = useState<RoleType | null>(null)
    const queryClient = useQueryClient()

    const [editPermission, deletePermission] = useMemo(() => {
        return [requirePermission("role:update"), requirePermission("role:delete")]
    }, [permissions])

    const request = useAutoRequest<RoleType[]>({
        queryKey: ["roles"],
        url: "/role",
    })

    const deleteRequest = useMutateRequest({
        url: "/role",
        method: "DELETE",
    })

    const onEdit = useCallback((role: RoleType) => {
        if(editPermission) setEditRole(role)
    }, [editPermission])

    const onDelete = useCallback((role: RoleType) => {
        if(!deletePermission || role.is_immutable) return
        sileo.action({
            title: "Delete role?",
            description: `"${role.name}" will be permanently deleted.`,
            duration: null,
            button: {
                title: "Delete",
                onClick: () => {
                    sileo.clear("bottom-center")
                    deleteRequest.mutate({ id: role.id }, {
                        onSuccess: () => {
                            queryClient.invalidateQueries({ queryKey: ["roles"] })
                            sileo.success({ title: "Role deleted", description: "The role has been deleted." })
                        },
                        onError: (error) => {
                            const err = error as Error & { detail?: string }
                            sileo.error({ title: "Delete failed", description: err.message ?? err.detail })
                        },
                    })
                },
            },
        })
    }, [deletePermission, deleteRequest, queryClient])

    if (editRole) {
        return (
            <>
                <div className="flex items-center gap-1">
                    <button
                        className="text-blue-400 hover:text-blue-600 flex items-center"
                        onClick={() => setEditRole(null)}
                    >
                        <ArrowLeft strokeWidth={3} size={18} />
                    </button>
                    <span className="font-bold">Edit Role</span>
                </div>
                <RoleForm role={editRole} onSuccess={() => setEditRole(null)} />
            </>
        )
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of roles</TableCaption>
                <RoleTableColumns />
                <TableBody>
                    {request.data?.map((role) => (
                        <RoleTableRow 
                            key={role.id} 
                            role={role} 
                            onEdit={onEdit}
                            onDelete={onDelete}
                            editPermission={editPermission}
                            deletePermission={deletePermission}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default RoleTable
