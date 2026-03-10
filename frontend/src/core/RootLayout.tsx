import { useLayoutEffect } from "react"
import { useLocation } from "react-router-dom"
import { AppStore } from "./AppContext"
import { getCookie } from "@/shared/utils"

function syncUserFromCookies() {
    const username = getCookie("user")
    const roleName = getCookie("role")
    AppStore.setState({
        user: username && roleName ? { name: username, roleName } : null
    })
}

// Sync once at module load before any render
syncUserFromCookies()

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation()

    useLayoutEffect(() => {
        syncUserFromCookies()
    }, [location])

    return <>{children}</>
}

export default RootLayout
