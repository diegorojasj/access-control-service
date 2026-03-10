import { createBrowserRouter } from 'react-router-dom'
import AuthorizedComponent from './core/AuthorizedComponent'
import AuthRoute from './auth/auth.route'

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
    ...AuthRoute(),
])

export default router