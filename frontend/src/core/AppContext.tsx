import { useEffect } from "react"
import { sileo, Toaster } from "sileo"
import { create } from "zustand"
import type { AppContextType } from "./infrastructure/appContext.infrastructure"
import { decodePermissions } from "@/shared/utils"

export const AppStore = create<AppContextType>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    permissions: [],
    setPermissions: (permissions) => set({ permissions }),
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
        permissions: [],
        openToDoListForm: false,
        openToDoListTable: false,
        openUserManagementForm: false,
        openUserManagementTable: false,
        openRoleManagementForm: false,
        openRoleManagementTable: false
    })
}))

const AppContext = ({ children }: { children: React.ReactNode }) => {
    const user = AppStore((s) => s.user)
    const setPermissions = AppStore((s) => s.setPermissions)
    const reset = AppStore((s) => s.reset)

    useEffect(() => {
        if (!user) return

        const es = new EventSource("/auth/stream", { withCredentials: true })

        es.addEventListener("permissions", async (event: MessageEvent) => {
            const encoded: string[] = JSON.parse(event.data)
            const decoded = await Promise.all(encoded.map(decodePermissions))
            setPermissions(decoded.filter((p) => p !== ""))
        })

        es.addEventListener("logout", () => {
            sileo.warning({
                title: "Session ended",
                description: "Your session has been terminated"
            })
            reset()
        })

        return () => es.close()
    }, [user])

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