import { useQueryClient } from "@tanstack/react-query"
import { useMutateRequest, useAutoRequest } from "@/shared/useRequest"
import type { RoleType } from "../infrastructure/roleType.infrastructure"
import type { PermissionType } from "@/permissionManagement/infrastructure/permissionType.infrastructure"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { sileo } from "sileo"
import { Spinner } from "@/components/ui/spinner"
import { useLayoutEffect, useState } from "react"

const RoleForm = ({ role, onSuccess }: { role?: RoleType; onSuccess?: () => void }) => {
    const queryClient = useQueryClient()
    const [selectedPermission, setSelectedPermission] = useState("")
    const [assignedPermissions, setAssignedPermissions] = useState<PermissionType[]>([])

    const request = useMutateRequest({
        url: "/role",
        method: role ? "PUT" : "POST",
    })

    const allPermissionsRequest = useAutoRequest<PermissionType[]>({
        queryKey: ["all-permissions"],
        url: "/permission",
        method: "GET",
    })

    const permissionsAssignedRequest = useAutoRequest<PermissionType[]>({
        queryKey: ["role-permissions", role?.id],
        url: `/role/${role?.id}/permissions`,
        enabled: !!role,
    })

    const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget as typeof e.currentTarget & {
            name: HTMLInputElement
            description: HTMLInputElement
        }

        request.mutate(
            {
                id: role?.id,
                name: form.name.value,
                description: form.description.value,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["roles"] })
                    sileo.success({
                        title: role ? "Role updated" : "Role created",
                        description: role ? "The role has been updated." : "The role has been created.",
                    })
                    form.reset()
                    onSuccess?.()
                },
                onError: (error) => {
                    const err = error as Error & { detail?: string }
                    sileo.error({
                        title: role ? "Update failed" : "Create failed",
                        description: err.message ?? err.detail,
                    })
                },
            }
        )
    }

    const onAssign = () => {
        if (assignedPermissions.some((p) => p.name === selectedPermission)) {
            sileo.warning({ title: "Permission already assigned" })
            return
        }
        const permission = allPermissionsRequest.data?.find((p) => p.name === selectedPermission)
        if (!permission) return
        setAssignedPermissions((prev) => [...prev, permission])
    }

    const onRemove = (permissionName: string) => {
        setAssignedPermissions((prev) => prev.filter((p) => p.name !== permissionName))
    }

    const unassignedPermissions = allPermissionsRequest.data?.filter(
        (p) => !assignedPermissions.some((a) => a.name === p.name)
    ) ?? []

    useLayoutEffect(() => {
        if (permissionsAssignedRequest.data) {
            setAssignedPermissions(permissionsAssignedRequest.data)
        }
    }, [permissionsAssignedRequest.data])

    return (
        <div className="p-2 flex flex-col gap-4">
            <form id="role-form" onSubmit={onSubmit}>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input id="name" name="name" type="text" placeholder="Role name" defaultValue={role?.name} required maxLength={50} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="description" className="text-sm font-medium">Description</label>
                        <Input id="description" name="description" type="text" placeholder="Description" defaultValue={role?.description} maxLength={255} />
                    </div>

                    {role && (
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium">Permissions</span>

                            <div className="flex gap-2">
                                <select
                                    className="flex-1 border rounded-md px-3 py-1.5 text-sm bg-background"
                                    value={selectedPermission}
                                    onChange={(e) => setSelectedPermission(e.target.value)}
                                >
                                    <option value="">Select a permission...</option>
                                    {unassignedPermissions.map((p) => (
                                        <option key={p.name} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                                <Button
                                    size="sm"
                                    onClick={onAssign}
                                    disabled={!selectedPermission || permissionsAssignedRequest.isLoading}
                                >
                                    {permissionsAssignedRequest.isLoading ? <Spinner /> : "Assign"}
                                </Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Permission</TableHead>
                                        <TableHead className="w-[200px]">Description</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assignedPermissions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground text-sm">
                                                No permissions assigned
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {assignedPermissions.map((p) => (
                                        <TableRow key={p.name}>
                                            <TableCell className="text-sm">{p.name}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground"><div className="max-w-[200px] whitespace-normal break-words">{p.description ?? "—"}</div></TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                    onClick={() => onRemove(p.name)}
                                                >
                                                    Remove
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    <Button type="submit" form="role-form" className="w-full" disabled={request.isPending}>
                        {request.isPending ? <Spinner /> : role ? "Save changes" : "Create role"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default RoleForm
