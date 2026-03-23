import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const TodoColumns = () => {
    return <Table className="table-fixed w-full">
        <TableHeader>
            <TableRow>
                <TableHead className="w-[20%]">Task</TableHead>
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead className="w-[10%]">Status</TableHead>
                <TableHead className="w-[15%]">User</TableHead>
                <TableHead className="w-[15%]">Actions</TableHead>
            </TableRow>
        </TableHeader>
    </Table>
}

export default TodoColumns