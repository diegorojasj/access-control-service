import { AppStore } from "@/core/AppContext"
import { Navigate } from "react-router-dom"
import LoginForm from "../presentation/loginForm.presentation"

const Login = () => {
    const { user } = AppStore()

    if (user) return <Navigate to="/" replace />

    return (
        <div>
            <LoginForm />
        </div>
    )
}

export default Login