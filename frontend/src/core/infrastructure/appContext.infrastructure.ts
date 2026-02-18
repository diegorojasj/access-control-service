import type { AuthType } from "@/auth/infrastructure/authType.infrastructure"

export interface AppContextType {
    user: AuthType | null
    setUser: (user: AuthType | null) => void
}