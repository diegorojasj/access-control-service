import { lazy, Suspense, useEffect } from "react"
import MenuBar from "@/shared/MenuBar"
import { AppStore } from "./AppContext"
import UserFormApplication from "@/userManagement/application/userForm.application";
import TodoListTableApplication from "@/todoList/application/todoListTable.application";
import TodoListFormApplication from "@/todoList/application/todoListForm.application";

const UserTableApplication = lazy(() => import("@/userManagement/application/userTable.application"))

const Layout = ({ children }: { children: React.ReactNode }) => {
    const {
        openUserManagementTable, openUserManagementForm,
        openToDoListTable, openToDoListForm,
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
        </div>
    );
};

export default Layout