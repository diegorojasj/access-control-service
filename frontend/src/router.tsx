import { createBrowserRouter } from 'react-router-dom'
import AuthorizedComponent from './core/AuthorizedComponent'
import AuthRoute from './auth/auth.route'

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthorizedComponent />
    },
    ...AuthRoute(),
])

export default router