import { useQueryClient } from "@tanstack/react-query"
import { useMutateRequest } from "@/shared/useRequest"
import type { RoleType } from "../infrastructure/roleType.infrastructure"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sileo } from "sileo"
import { Spinner } from "@/components/ui/spinner"

const RoleForm = ({ role, onSuccess }: { role?: RoleType; onSuccess?: () => void }) => {
    const queryClient = useQueryClient()

    const request = useMutateRequest({
        url: role ? "/role/update" : "/role/create",
        method: "POST",
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
                    sileo.error({
                        title: role ? "Update failed" : "Create failed",
                        description: (error as Error).message,
                    })
                },
            }
        )
    }

    return (
        <div className="p-2">
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

                    <Button type="submit" form="role-form" className="w-full" disabled={request.isPending}>
                        {request.isPending ? <Spinner /> : role ? "Save changes" : "Create role"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default RoleForm
