import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAutoRequest } from "@/shared/useRequest"
import type { UserType } from "../infrastructure/userType.infrastructure"
import { Button } from "@/components/ui/button"

const UserTable = () => {
    const request = useAutoRequest<UserType[]>({
        queryKey: ["users"],
        url: "/user/list"
    })

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
                    {request.data?.map((user)=><TableRow>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                            <Button>Edit</Button>
                            <Button>Delete</Button>
                        </TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </div>
    )
}

export default UserTable