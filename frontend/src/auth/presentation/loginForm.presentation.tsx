import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { AppStore } from "@/core/AppContext"
import { useMutateRequest } from "@/shared/useRequest"
import { hashPassword, getCookie } from "@/shared/utils"
import { useNavigate } from "react-router-dom"
import { sileo } from "sileo"

const LoginForm = () => {
    // Variables
    const navigate = useNavigate()
    const request = useMutateRequest({
        url: '/auth/login',
        method: 'POST'
    })

    // Functions
    const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { username, password } = e.currentTarget as typeof e.currentTarget & {
            username: HTMLInputElement
            password: HTMLInputElement
        }

        const hashedPassword = await hashPassword(password.value)

        request.mutate({
            username: username.value,
            password: hashedPassword
        }, {
            onSuccess: () => {
                const name = getCookie("user")
                const roleName = getCookie("role")
                if (name && roleName) {
                    AppStore.setState({ user: { name, roleName } })
                }
                sileo.success({
                    title: "Login successful",
                    description: "You are now logged in",
                })
                navigate('/')
            },
            onError: (error) => {
                const err = error as Error & { detail?: string }
                sileo.error({
                    title: "Login failed",
                    description: err.message ?? err.detail,
                })
            }
        })
    }

    return (
        <Card className="w-full max-w-sm p-6">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your username below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="login-form" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Input
                                id="username"
                                type="text"
                                placeholder="Username"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Input id="password" type="password" placeholder="Password" required />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" form="login-form" className="w-full" disabled={request.isPending}>
                    {request.isPending ? <Spinner /> : "Login"}
                </Button>
            </CardFooter>
        </Card>
    )
}


export default LoginForm