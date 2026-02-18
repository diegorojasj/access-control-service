import { createBrowserRouter } from 'react-router-dom'
import AuthorizedComponent from './core/AuthorizedComponent'
import Login from './auth/application/login.application'

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthorizedComponent />,
        children: [
            // {
            //     path: "/",
            //     element: <Login />,
            // },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
])

export default router