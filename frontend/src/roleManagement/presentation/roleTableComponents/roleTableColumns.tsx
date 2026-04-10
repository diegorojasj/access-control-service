import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

const RoleTableColumns = () => {
    return <TableHeader>
         <TableRow>
             <TableHead>Name</TableHead>
             <TableHead className="w-[200px]">Description</TableHead>
             <TableHead>Actions</TableHead>
         </TableRow>
    </TableHeader>
}

export default RoleTableColumns