import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAutoRequest, useMutateRequest } from "@/shared/useRequest"
import type { UserType } from "../infrastructure/userType.infrastructure"
import { Button } from "@/components/ui/button"
import { sileo } from "sileo"
import { useQueryClient } from "@tanstack/react-query"

const UserTable = () => {
    const queryClient = useQueryClient()
    const request = useAutoRequest<UserType[]>({
        queryKey: ["users"],
        url: "/user/list"
    })

    const statusChangeRequest = useMutateRequest<UserType[]>({
        url: "/user/status-change",
        method: "POST"
    })

    const onStatusChange = (id: number) => {
        statusChangeRequest.mutate({
            id
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["users"] })
                sileo.success({
                    title: "User status changed successfully",
                    description: "The user has been status changed.",
                })
            },
            onError: (error) => {
                sileo.error({
                    title: "User status change failed",
                    description: (error as Error).message,
                })
            }
        })
    }

const renderUserData = (user: UserType) => {
        let buttonStatusText = "Suspend"
        let buttonStatusColor = "red-400"
        if (user.status == 0) {
            buttonStatusText = "Activate"
            buttonStatusColor = "green-400"
        }
        return <TableRow key={user.id}>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell className="flex gap-2" >
                <Button className="bg-green-400 hover:bg-green-500 text-white" size="sm" variant="secondary" >Edit</Button>
                <Button className={`bg-${buttonStatusColor} hover:bg-${buttonStatusColor} text-white`} size="sm" variant="secondary" onClick={() => onStatusChange(user.id)} >{buttonStatusText}</Button>
            </TableCell>
        </TableRow>
    }
    return (
        <div>
            <Table>
                <TableCaption>A list of users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {request.data?.map((user) => renderUserData(user))}
                </TableBody>
            </Table>
        </div>
    )
}

export default UserTable