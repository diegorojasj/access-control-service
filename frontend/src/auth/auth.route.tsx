import Login from "./application/login.application";
import Logout from "./application/logout.application";

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