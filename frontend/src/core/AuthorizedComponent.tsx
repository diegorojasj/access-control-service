import Layout from "@/core/Layout"
import RootLayout from "@/core/RootLayout"
import { Navigate, Outlet } from "react-router-dom"
import { AppStore } from "./AppContext"

const AuthorizedComponent = () => {
    const { user } = AppStore()

    return (
        <RootLayout>
            {!user
                ? <Navigate to="/login" replace />
                : <Layout><Outlet /></Layout>
            }
        </RootLayout>
    )
}

export default AuthorizedComponent