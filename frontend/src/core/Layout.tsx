import { lazy, Suspense, useEffect, type ReactNode } from "react"
import MenuBar from "@/shared/MenuBar"
import { AppStore } from "@/core/AppContext"

const UserFormApplication = lazy(() => import("@/userManagement/application/userForm.application"))
const UserTableApplication = lazy(() => import("@/userManagement/application/userTable.application"))
const RoleTableApplication = lazy(() => import("@/roleManagement/application/roleTable.application"))
const TodoListFormApplication = lazy(() => import("@/todoList/application/todoListForm.application"))
const TodoListTableApplication = lazy(() => import("@/todoList/application/todoListTable.application"))
const RoleFormApplication = lazy(() => import("@/roleManagement/application/roleForm.application"))

const Layout = ({ children }: { children: ReactNode }) => {
    const {
        openUserManagementTable, openUserManagementForm,
        openToDoListTable, openToDoListForm,
        openRoleManagementTable, openRoleManagementForm,
        reset,
    } = AppStore()

    useEffect(() => {
        return () => {
            reset()
        }
    }, [])

    return (
        <div className="min-h-screen flex flex-col pt-4 px-4">
            <MenuBar />
            <div className="flex-1 flex justify-center pt-8 p-4">
                <div className="w-full max-w-5xl">
                    {children}
                </div>
            </div>
            {openUserManagementTable && (
                <Suspense fallback={null}>
                    <UserTableApplication />
                </Suspense>
            )}
            {
            openUserManagementForm && (
                <Suspense fallback={null}>
                    <UserFormApplication />
                </Suspense>
            )}
            {openToDoListTable && (
                <Suspense fallback={null}>
                    <TodoListTableApplication />
                </Suspense>
            )}
            {openToDoListForm && (
                <Suspense fallback={null}>
                    <TodoListFormApplication />
                </Suspense>
            )}
            {openRoleManagementTable && (
                <Suspense fallback={null}>
                    <RoleTableApplication />
                </Suspense>
            )}
            {openRoleManagementForm && (
                <Suspense fallback={null}>
                    <RoleFormApplication />
                </Suspense>
            )}
        </div>
    );
};

export default Layout
