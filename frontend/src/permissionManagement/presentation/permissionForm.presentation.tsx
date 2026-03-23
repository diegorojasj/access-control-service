import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAutoRequest, useMutateRequest } from "@/shared/useRequest"
import type { PermissionType } from "../infrastructure/permissionType.infrastructure"
import type { RoleType } from "@/roleManagement/infrastructure/roleType.infrastructure"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sileo } from "sileo"
import { Spinner } from "@/components/ui/spinner"

const NONE_VALUE = "__none__"

const PermissionForm = ({ permission, onSuccess }: { permission?: PermissionType; onSuccess?: () => void }) => {
    const queryClient = useQueryClient()

    const request = useMutateRequest({
        url: permission ? "/permission/update" : "/permission/create",
        method: "POST",
    })

    const roleRequest = useAutoRequest<RoleType[]>({
        queryKey: ["roles"],
        url: "/role/list",
        method: "GET",
    })

    const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget as typeof e.currentTarget & {
            name: HTMLInputElement
            description: HTMLInputElement
        }

        request.mutate(
            {
                name: form.name.value,
                description: form.description.value || null,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["permissions"] })
                    sileo.success({
                        title: permission ? "Permission updated" : "Permission created",
                        description: permission ? "The permission has been updated." : "The permission has been created.",
                    })
                    form.reset()
                    onSuccess?.()
                },
                onError: (error) => {
                    const err = error as Error & { detail?: string }
                    sileo.error({
                        title: permission ? "Update failed" : "Create failed",
                        description: err.message ?? err.detail,
                    })
                },
            }
        )
    }

    return (
        <div className="p-2">
            <form id="permission-form" onSubmit={onSubmit}>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Permission name"
                            defaultValue={permission?.name}
                            required
                            maxLength={50}
                            disabled={!!permission}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="description" className="text-sm font-medium">Description</label>
                        <Input id="description" name="description" type="text" placeholder="Description" defaultValue={permission?.description ?? ""} maxLength={255} />
                    </div>

                    <Button type="submit" form="permission-form" className="w-full" disabled={request.isPending}>
                        {request.isPending ? <Spinner /> : permission ? "Save changes" : "Create permission"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default PermissionForm
