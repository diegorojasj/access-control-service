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
])

export default router