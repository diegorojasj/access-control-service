import { Toaster } from "sileo"
import { create } from "zustand"
import type { AppContextType } from "./infrastructure/appContext.infrastructure"

export const AppStore = create<AppContextType>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    // To Do List
    openToDoListForm: false,
    setOpenToDoListForm: (bool) => set({ openToDoListForm: bool }),
    openToDoListTable: false,
    setOpenToDoListTable: (bool) => set({ openToDoListTable: bool }),
    // User Management
    openUserManagementForm: false,
    setOpenUserManagementForm: (bool) => set({ openUserManagementForm: bool }),
    openUserManagementTable: false,
    setOpenUserManagementTable: (bool) => set({ openUserManagementTable: bool }),
    // Role Management
    openRoleManagementForm: false,
    setOpenRoleManagementForm: (bool) => set({ openRoleManagementForm: bool }),
    openRoleManagementTable: false,
    setOpenRoleManagementTable: (bool) => set({ openRoleManagementTable: bool }),
    reset: () => set({
        user: null,
        openToDoListForm: false,
        openToDoListTable: false,
        openUserManagementForm: false,
        openUserManagementTable: false,
        openRoleManagementForm: false,
        openRoleManagementTable: false
    })
}))

const AppContext = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Toaster
                position="bottom-center"
                offset={10}
                options={{
                    duration: 2750,
                    fill: "black",
                    styles: {
                        title: "text-white!",
                        description: "text-white/75!",
                    },
                }}
            />
            {children}
        </div>
    )
}

export default AppContext