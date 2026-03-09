import Layout from "@/core/Layout"
import { Navigate, Outlet } from "react-router-dom"
import { AppStore } from "./AppContext"

const AuthorizedComponent = () => {
    const { user } = AppStore()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return (
        <Layout>
            <Outlet />
        </Layout>
    )
}

export default AuthorizedComponent