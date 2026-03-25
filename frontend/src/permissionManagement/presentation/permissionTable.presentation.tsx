import { ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAutoRequest, useMutateRequest } from "@/shared/useRequest"
import type { PermissionType } from "../infrastructure/permissionType.infrastructure"
import { Button } from "@/components/ui/button"
import { sileo } from "sileo"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import PermissionForm from "./permissionForm.presentation"

const PermissionTable = () => {
    const [editPermission, setEditPermission] = useState<PermissionType | null>(null)
    const queryClient = useQueryClient()

    const request = useAutoRequest<PermissionType[]>({
        queryKey: ["permissions"],
        url: "/permission",
    })

    const deleteRequest = useMutateRequest({
        url: "/permission",
        method: "DELETE",
    })

    const onDelete = (permission: PermissionType) => {
        sileo.action({
            title: "Delete permission?",
            description: `"${permission.name}" will be permanently deleted.`,
            duration: null,
            button: {
                title: "Delete",
                onClick: () => {
                    sileo.clear("bottom-center")
                    deleteRequest.mutate({ name: permission.name }, {
                        onSuccess: () => {
                            queryClient.invalidateQueries({ queryKey: ["permissions"] })
                            sileo.success({ title: "Permission deleted", description: "The permission has been deleted." })
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

    const renderRow = (permission: PermissionType) => (
        <TableRow key={permission.name}>
            <TableCell>{permission.name}</TableCell>
            <TableCell><div className="max-w-[200px] whitespace-normal break-words">{permission.description ?? "—"}</div></TableCell>
            <TableCell className="flex gap-2">
                <Button
                    className="bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditPermission(permission)}
                >
                    Edit
                </Button>
                <Button
                    className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    size="sm"
                    variant="secondary"
                    onClick={() => onDelete(permission)}
                >
                    Delete
                </Button>
            </TableCell>
        </TableRow>
    )

    if (editPermission) {
        return (
            <>
                <div className="flex items-center gap-1">
                    <button
                        className="text-blue-400 hover:text-blue-600 flex items-center"
                        onClick={() => setEditPermission(null)}
                    >
                        <ArrowLeft strokeWidth={3} size={18} />
                    </button>
                    <span className="font-bold">Edit Permission</span>
                </div>
                <PermissionForm permission={editPermission} onSuccess={() => setEditPermission(null)} />
            </>
        )
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of permissions</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-[200px]">Description</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {request.data?.map((permission) => renderRow(permission))}
                </TableBody>
            </Table>
        </div>
    )
}

export default PermissionTable
