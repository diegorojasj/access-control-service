import { Toaster } from "sileo"
import { create } from "zustand"
import type { AppContextType } from "./infrastructure/appContext.infrastructure"

export const AppStore = create<AppContextType>((set) => ({
    user: null,
    setUser: (user) => set({ user })
}))

const AppContext = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Toaster
                position="top-center"
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