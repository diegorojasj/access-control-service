import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAutoRequest, useMutateRequest } from "@/shared/useRequest"
import type { UserType } from "../infrastructure/userType.infrastructure"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { hashPassword } from "@/shared/utils"
import { sileo } from "sileo"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RoleType } from "@/roleManagement/infrastructure/roleType.infrastructure"
import { Eye, EyeOff } from "lucide-react"

const UserForm = ({ user, onSuccess }: { user?: UserType, onSuccess?: () => void }) => {
    const queryClient = useQueryClient()
    const [role, setRole] = useState(user?.role ?? "")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [passwordError, setPasswordError] = useState<string | null>(null)

    const request = useMutateRequest<UserType[]>({
        url: "/user",
        method: user ? "PUT" : "POST"
    })

    const roleRequest = useAutoRequest<RoleType[]>({
        queryKey: ["roles"],
        url: "/role",
        method: "GET"
    })

    const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget as typeof e.currentTarget & {
            name: HTMLInputElement
            username: HTMLInputElement
            password: HTMLInputElement
            current_password: HTMLInputElement
            confirm: HTMLInputElement
        }

        const password = form.password.value
        let current_password = null
        if (password && password !== "" && user) {
            current_password = form.current_password.value
            if (current_password !== "") {
                setPasswordError("The current password is required to update the password")
                return
            }
        }
        const confirm = form.confirm.value

        if ((!user && password !== confirm) || (user && password && password !== "" && password !== confirm)) {
            setPasswordError("Passwords do not match")
            return
        }
        setPasswordError(null)

        request.mutate({
            id: user?.id,
            name: form.name.value,
            username: form.username.value,
            password: password && password !== "" ? await hashPassword(password) : undefined,
            current_password: current_password && current_password !== "" ? await hashPassword(current_password) : undefined,
            role,
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["users"] })
                sileo.success({
                    title: user ? "User updated successfully" : "User created successfully",
                    description: user ? "The user has been updated." : "The user has been created.",
                })
                form.reset()
                onSuccess?.()
            },
            onError: (error) => {
                const err = error as Error & { detail?: string }
                sileo.error({
                    title: user ? "User update failed" : "User creation failed",
                    description: err.message ?? err.detail,
                })
            }
        })
    }

    return (
        <div className="p-2">
            <form id="user-form" onSubmit={onSubmit}>
                <div className="flex flex-col gap-2">

                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input id="name" name="name" type="text" placeholder="Full name" defaultValue={user?.name} required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="text-sm font-medium">Username</label>
                        <Input id="username" name="username" type="text" placeholder="Username" defaultValue={user?.username} required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Role</label>
                        <Select value={role} onValueChange={setRole} required>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent className="z-[1500]">
                                {roleRequest.data?.map((r) => (
                                    <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {user && <div className="flex flex-col gap-1">
                        <label htmlFor="current_password" className="text-sm font-medium">Current Password</label>
                        <div className="relative">
                            <Input
                                id="current_password"
                                name="current_password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Current Password"
                                className="pr-10"
                                required={!user}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                    </div>}

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="pr-10"
                                required={!user}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="confirm" className="text-sm font-medium">Confirm password</label>
                        <div className="relative">
                            <Input
                                id="confirm"
                                name="confirm"
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm password"
                                className="pr-10"
                                required={!user}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={showConfirm ? "Hide password" : "Show password"}
                            >
                                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                        {passwordError && (
                            <p className="text-sm text-destructive">{passwordError}</p>
                        )}
                    </div>

                    <Button type="submit" form="user-form" className="w-full" disabled={request.isPending}>
                        {request.isPending ? <Spinner /> : user ? "Save changes" : "Create user"}
                    </Button>

                </div>
            </form>
        </div>
    )
}

export default UserForm
