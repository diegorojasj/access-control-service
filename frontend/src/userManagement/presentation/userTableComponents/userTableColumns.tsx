import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

const UserTableColumns = () => {
    return (
        <TableHeader>
            <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
            </TableRow>
        </TableHeader>
    )
}

export default UserTableColumns