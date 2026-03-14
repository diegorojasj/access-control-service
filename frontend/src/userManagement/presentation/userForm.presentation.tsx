import { useAutoRequest, useMutateRequest } from "@/shared/useRequest"
import type { UserType } from "../infrastructure/userType.infrastructure"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { encode } from "@/shared/utils"
import { sileo } from "sileo"
import { Spinner } from "@/components/ui/spinner"
import { Select } from "@/components/ui/select"

const UserForm = ({ edit }: { edit: boolean }) => {
    const request = useMutateRequest<UserType[]>({
        url: edit ? "/user/update" : "/user/create",
        method: "POST"
    })
    const roleRequest = useAutoRequest<RoleType[]>({
        url: "/role/list",
        method: "GET"
    })

    const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { username, password } = e.currentTarget as typeof e.currentTarget & {
            username: HTMLInputElement
            password: HTMLInputElement
        }

        const encodePassword = encode(password.value)

        request.mutate({
            username: username.value,
            password: encodePassword
        }, {
            onSuccess: () => {
                sileo.success({
                    title: "User created successfully",
                    description: "The user has been created successfully",
                })
            },
            onError: (error) => {
                sileo.error({
                    title: "User creation failed",
                    description: (error as Error).message,
                })
            }
        })
    }

    return (
        <div>
            <form id="login-form" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Input
                                id="name"
                                type="text"
                                placeholder="Name"
                                required
                            />
                            <Input
                                id="username"
                                type="text"
                                placeholder="Username"
                                required
                            />
                            <Select
                                name="role"
                                required
                            >
                                {/* <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem> */}
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Input id="password" type="password" placeholder="Password" required />
                        </div>
                    </div>
                    <div>
                        <Button type="submit" form="login-form" className="w-full" disabled={request.isPending}>
                            {request.isPending ? <Spinner /> : "Login"}
                        </Button>
                    </div>
                </form>
        </div>
    )
}

export default UserForm