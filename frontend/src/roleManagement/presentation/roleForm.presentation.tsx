import { useQueryClient } from "@tanstack/react-query"
import { useMutateRequest, useAutoRequest } from "@/shared/useRequest"
import type { RoleType } from "../infrastructure/roleType.infrastructure"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sileo } from "sileo"
import { Spinner } from "@/components/ui/spinner"
import { useLayoutEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import PermissionAssign from "./permissionAssign.presentation"
import { decodePermissions } from "@/shared/utils"

const RoleForm = ({ role, onSuccess }: { role?: RoleType; onSuccess?: () => void }) => {
    const queryClient = useQueryClient()
    const [selectedPermission, setSelectedPermission] = useState("")
    const [assignedPermissions, setAssignedPermissions] = useState<string[]>([])

    const request = useMutateRequest({
        url: "/role",
        method: role ? "PUT" : "POST",
    })

    const allPermissionsRequest = useAutoRequest<string[], string[]>({
        queryKey: ["all-permissions"],
        url: "/permission",
        method: "GET",
        transform: async (data) => {
            const decoded = await Promise.all(data.map((p) => decodePermissions(p)))
            return decoded.filter((p) => p !== "")
        },
    })

    const permissionsAssignedRequest = useAutoRequest<string[], string[]>({
        queryKey: ["role-permissions", role?.id],
        url: `/role/${role?.id}/permissions`,
        enabled: !!role,
        transform: async (data) => {
            const decoded = await Promise.all(data.map((p) => decodePermissions(p)))
            return decoded.filter((p) => p !== "")
        },
    })

    const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        if (role && role.is_immutable) return
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
                ...(role ? { permissionList: assignedPermissions } : {}),
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["roles"] })
                    queryClient.invalidateQueries({ queryKey: ["role-permissions", role?.id] })
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
        if (assignedPermissions.some((p) => p === selectedPermission)) {
            sileo.warning({ title: "Permission already assigned" })
            return
        }
        const permission = allPermissionsRequest.data?.find((p) => p === selectedPermission)
        if (!permission) return
        setAssignedPermissions((prev) => [...prev, permission])
    }

    const onCheck = (permissionName: string, action: "add" | "remove") => {
        if (action === "add") {
            const permission = allPermissionsRequest.data?.find((p) => p === permissionName)
            if (!permission) return
            setAssignedPermissions((prev) => [...prev, permission])
        } else {
            setAssignedPermissions((prev) => prev.filter((p) => p !== permissionName))
        }
    }

    const unassignedPermissions = allPermissionsRequest.data?.filter(
        (p) => !assignedPermissions.some((a) => a === p)
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
                        <Textarea id="description" name="description" placeholder="Description" defaultValue={role?.description} maxLength={255} />
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
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                <Button
                                    size="sm"
                                    onClick={onAssign}
                                    type="button"
                                >
                                    Assign
                                </Button>
                            </div>
                            <PermissionAssign 
                                allPermissionsRequest={allPermissionsRequest}
                                assignedPermissions={assignedPermissions} 
                                onCheck={onCheck} 
                            />
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
