import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { UseQueryResult } from "@tanstack/react-query"

const PermissionAssign = ({ allPermissionsRequest, assignedPermissions, onCheck }: { allPermissionsRequest: UseQueryResult<string[], Error>, assignedPermissions: string[], onCheck: (permissionName: string, action: "add" | "remove") => void }) => {
    return <Table title="Permissions List" >
        <TableHeader>
            <TableRow>
                <TableHead>Section</TableHead>
                <TableHead className="w-[200px]">Description</TableHead>
                <TableHead>All</TableHead>
                <TableHead>View</TableHead>
                <TableHead>Create</TableHead>
                <TableHead>Update</TableHead>
                <TableHead>Delete</TableHead>
                <TableHead>Custom</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {assignedPermissions.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground text-sm">
                        No permissions assigned
                    </TableCell>
                </TableRow>
            )}
            {assignedPermissions.map((p) =>{
                const checked = assignedPermissions.some((a) => a === p)
                return <TableRow key={p}>
                    <TableCell className="text-sm">
                        <span className="text-sm">{p}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground"><div className="max-w-[200px] whitespace-normal break-words">{p}</div></TableCell>
                    <TableCell>
                        <Checkbox
                            checked={checked}
                            onCheckedChange={() => onCheck(p, checked ? "remove" : "add")}
                        />
                    </TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>
}

export default PermissionAssign