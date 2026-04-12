import { lazy } from "react";
import { createBrowserRouter } from 'react-router-dom'
import AuthRoute from '@/auth/auth.route'

const AuthenticatedLayout = lazy(() => import('@/core/AuthenticatedLayout'));

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthenticatedLayout />,
    },
    ...AuthRoute(),
], {
    basename: process.env.NODE_ENV === "production" ? "/access-control-service" : "/",
})

export default router