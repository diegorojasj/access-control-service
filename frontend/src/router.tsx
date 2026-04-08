import { createBrowserRouter } from 'react-router-dom'
import AuthenticatedLayout from '@/core/AuthenticatedLayout'
import AuthRoute from '@/auth/auth.route'

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthenticatedLayout />
    },
    ...AuthRoute(),
])

export default router