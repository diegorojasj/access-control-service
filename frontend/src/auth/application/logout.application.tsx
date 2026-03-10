import { Spinner } from "@/components/ui/spinner"
import { Navigate } from "react-router-dom"
import { useAutoRequest } from "@/shared/useRequest"
import { useLayoutEffect } from "react"
import { AppStore } from "@/core/AppContext"

const Logout = () => {
    const { setUser } = AppStore()
    const request = useAutoRequest({ queryKey: ["logout"], url: "/auth/logout", method: "POST" })

    useLayoutEffect(() => {
        setUser(null)
    }, [])

    return request.status === "success" ? <Navigate to="/login" replace /> : <Spinner />
}

export default Logout