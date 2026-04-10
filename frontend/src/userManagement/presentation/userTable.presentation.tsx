import { ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCaption } from "@/components/ui/table"
import { useAutoRequest, useMutateRequest } from "@/shared/useRequest"
import type { UserType } from "@/userManagement/infrastructure/userType.infrastructure"
import { sileo } from "sileo"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import UserForm from "@/userManagement/presentation/userForm.presentation"
import UserTableColumns from "@/userManagement/presentation/userTableComponents/userTableColumns";
import UserTableRow from "@/userManagement/presentation/userTableComponents/userTableRow";
import { AppStore } from "@/core/AppContext";

const UserTable = () => {
    const { permissions, requirePermission } = AppStore()
    const [editUser, setEditUser] = useState<UserType | null>(null)
    const queryClient = useQueryClient()
    const request = useAutoRequest<UserType[]>({
        queryKey: ["users"],
        url: "/user"
    })

    const [editPermission, suspendPermission, unsuspendPermission] = useMemo(() => {
        return [requirePermission('user:update'), requirePermission('user:suspend'), requirePermission('user:unsuspend')]
    }, [permissions])

    const statusChangeRequest = useMutateRequest<UserType[]>({
        url: "/user/status",
        method: "PATCH"
    })

    const onEdit = useCallback((user: UserType) => {
        if(editPermission) setEditUser(user)
    }, [editPermission])

    const onStatusChange = useCallback((user: UserType) => {
        const isSuspend = user.status == 1
        if((!suspendPermission && !unsuspendPermission) || (!suspendPermission && !isSuspend) || (!unsuspendPermission && isSuspend)) return
        sileo.action({
            title: isSuspend ? "Suspend user?" : "Activate user?",
            description: isSuspend
                ? `"${user.name}" will be suspended and lose access.`
                : `"${user.name}" will be activated and regain access.`,
            duration: null,
            button: {
                title: "Confirm",
                onClick: () => {
                    sileo.clear("bottom-center")
                    statusChangeRequest.mutate({ id: user.id }, {
                        onSuccess: () => {
                            queryClient.invalidateQueries({ queryKey: ["users"] })
                            sileo.success({
                                title: "User status changed successfully",
                                description: "The user has been status changed.",
                            })
                        },
                        onError: (error) => {
                            const err = error as Error & { detail?: string }
                            sileo.error({
                                title: "User status change failed",
                                description: err.message ?? err.detail,
                            })
                        }
                    })
                }
            }
        })
    }, [suspendPermission, unsuspendPermission, statusChangeRequest, queryClient])

    return (editUser ? <>
        <div className="flex items-center gap-1">
            <button
                className="text-blue-400 hover:text-blue-600 flex items-center"
                onClick={() => setEditUser(null)}
            >
                <ArrowLeft strokeWidth={3} size={18} />
            </button>
            <span className="font-bold">Edit User</span>
        </div>
        <UserForm user={editUser} onSuccess={() => setEditUser(null)} />
    </> :
        <div>
            <Table>
                <TableCaption>A list of users</TableCaption>
                <UserTableColumns />
                <TableBody>
                    {request.data?.map((user) => (
                        <UserTableRow 
                            key={user.id} 
                            user={user} 
                            onEdit={onEdit} 
                            onStatusChange={onStatusChange}
                            editPermission={editPermission}
                            suspendPermission={suspendPermission}
                            unsuspendPermission={unsuspendPermission}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default UserTable