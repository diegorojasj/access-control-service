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

    const deleteRequest = useMutateRequest<UserType[]>({
        url: "/user/delete",
        method: "POST"
    })

    const onDelete = (id: number) => {
        deleteRequest.mutate({
            id
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["users"] })
                sileo.success({
                    title: "User deleted successfully",
                    description: "The user has been deleted.",
                })
            },
            onError: (error) => {
                sileo.error({
                    title: "User deletion failed",
                    description: (error as Error).message,
                })
            }
        })
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
                    {request.data?.map((user) => <TableRow>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="flex gap-2" >
                            <Button className="bg-green-400 hover:bg-green-500 text-white" size="sm" variant="secondary" >Edit</Button>
                            <Button className="bg-red-400 hover:bg-red-500 text-white" size="sm" variant="secondary" onClick={() => onDelete(user.id)} >Delete</Button>
                        </TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </div>
    )
}

export default UserTable