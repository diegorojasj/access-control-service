import Login from "@/auth/application/login.application";
import Logout from "@/auth/application/logout.application";

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