import { lazy, Suspense } from "react"
import MenuBar from "@/shared/MenuBar"
import { AppStore } from "./AppContext"

const UserTableApplication = lazy(() => import("@/userManagement/application/userTable.application"))

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { openUserManagementTable } = AppStore()

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
        </div>
    );
};

export default Layout