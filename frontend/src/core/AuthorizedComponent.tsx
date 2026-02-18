import Layout from "@/core/Layout"
import { Await, Outlet } from "react-router-dom"
import { AppStore } from "./AppContext"
import { useLayoutEffect } from "react"
import { useNavigate } from "react-router-dom"

const AuthorizedComponent = () => {
    const { user, setUser } = AppStore()
    const navigate = useNavigate()
    useLayoutEffect(()=>{
        if(!user){
            navigate("/login")
        }
    }, [])
    const data = {}
    return (
        <Await resolve={data}>
            <Layout>
                <Outlet />
            </Layout>
        </Await>
    )
}

export default AuthorizedComponent