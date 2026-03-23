import type { UserType } from "@/userManagement/infrastructure/userType.infrastructure";

export type TodoType = {
    id: number;
    task: string;
    description: string;
    status: number;
    order: number
    user: UserType;
    updated_at: string;
}