import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

const TodoColumns = () => (
    <TableHeader>
        <TableRow>
            <TableHead className="w-[4%]" />
            <TableHead className="w-[18%]">Task</TableHead>
            <TableHead className="w-[33%]">Description</TableHead>
            <TableHead className="w-[10%]">Status</TableHead>
            <TableHead className="w-[15%]">User</TableHead>
            <TableHead className="w-[20%]">Actions</TableHead>
        </TableRow>
    </TableHeader>
)

export default TodoColumns