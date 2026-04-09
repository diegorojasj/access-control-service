import { lazy } from "react"

const Login = lazy(() => import("@/auth/application/login.application"));
const Logout = lazy(() => import("@/auth/application/logout.application"));

const AuthRoute = () => {
    return [
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/logout",
            element: <Logout />,
        },
    ]
}

export default AuthRoute