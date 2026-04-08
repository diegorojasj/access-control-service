import { ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAutoRequest, useMutateRequest } from "@/shared/useRequest"
import type { RoleType } from "@/roleManagement/infrastructure/roleType.infrastructure"
import { Button } from "@/components/ui/button"
import { sileo } from "sileo"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import RoleForm from "@/roleManagement/presentation/roleForm.presentation"

const RoleTable = () => {
    const [editRole, setEditRole] = useState<RoleType | null>(null)
    const queryClient = useQueryClient()

    const request = useAutoRequest<RoleType[]>({
        queryKey: ["roles"],
        url: "/role",
    })

    const deleteRequest = useMutateRequest({
        url: "/role",
        method: "DELETE",
    })

    const onDelete = (role: RoleType) => {
        if(role.is_immutable) return
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
    }

    const renderRow = (role: RoleType) => (
        <TableRow key={role.id}>
            <TableCell>{role.name}</TableCell>
            <TableCell><div className="max-w-[200px] whitespace-normal break-words">{role.description}</div></TableCell>
            <TableCell className="flex gap-2">
                {!role.is_immutable && <Button
                    className="bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditRole(role)}
                >
                    Edit
                </Button>}
                {!role.is_immutable && <Button
                    className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    size="sm"
                    variant="secondary"
                    onClick={() => onDelete(role)}
                >
                    Delete
                </Button>}
            </TableCell>
        </TableRow>
    )

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
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-[200px]">Description</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {request.data?.map((role) => renderRow(role))}
                </TableBody>
            </Table>
        </div>
    )
}

export default RoleTable
