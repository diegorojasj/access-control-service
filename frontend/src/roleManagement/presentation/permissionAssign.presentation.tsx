import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { UseQueryResult } from "@tanstack/react-query"
import CustomPermissionsCell from "@/roleManagement/presentation/permissionAssign/customPermissionsCell"
import { Checkbox } from "@/components/ui/checkbox"

const STANDARD_ACTIONS = ["all", "view", "create", "update", "delete"] as const
type StandardAction = typeof STANDARD_ACTIONS[number]

type Props = {
    allPermissionsRequest: UseQueryResult<string[], Error>
    assignedPermissions: string[]
    onCheck: (permissionName: string, action: "add" | "remove") => void
}

const PermissionAssign = ({ allPermissionsRequest, assignedPermissions, onCheck }: Props) => {
    const grouped = (allPermissionsRequest.data ?? []).reduce<Record<string, string[]>>((acc, p) => {
        const [entity] = p.split(":")
        if (!entity) return acc
        if (!acc[entity]) acc[entity] = []
        acc[entity].push(p)
        return acc
    }, {})

    const entities = Object.keys(grouped)

    const customByEntity = Object.fromEntries(
        entities.map((r) => [
            r,
            (grouped[r] ?? []).filter(
                (p) => !STANDARD_ACTIONS.includes((p.split(":")[1] ?? "") as StandardAction)
            ),
        ])
    )

    const hasAnyCustom = Object.values(customByEntity).some((c) => c.length > 0)

    const colSpan = STANDARD_ACTIONS.length + 1 + (hasAnyCustom ? 1 : 0)

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Section</TableHead>
                    <TableHead>All</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Create</TableHead>
                    <TableHead>Update</TableHead>
                    <TableHead>Delete</TableHead>
                    {hasAnyCustom && <TableHead>Custom</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {entities.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={colSpan} className="text-center text-muted-foreground text-sm">
                            No permissions available
                        </TableCell>
                    </TableRow>
                )}
                {entities.map((entity) => {
                    const permissions = grouped[entity] ?? []
                    const customPermissions = customByEntity[entity] ?? []
                    const allinoneAll = assignedPermissions.includes('allinone:all')

                    return (
                        <TableRow key={entity}>
                            <TableCell className="text-sm font-medium capitalize">{entity}</TableCell>
                            {STANDARD_ACTIONS.map((action) => {
                                const permName = `${entity}:${action}`
                                const available = permissions.includes(permName)
                                const checked = assignedPermissions.includes(permName)
                                const allineoneByAction = assignedPermissions.includes(`allinone:${action}`)
                                return (
                                    <TableCell key={action}>
                                        {available && (
                                            <Checkbox
                                                checked={allinoneAll || allineoneByAction || checked}
                                                onCheckedChange={() => onCheck(permName, checked ? "remove" : "add")}
                                                disabled={allinoneAll || allineoneByAction}
                                            />
                                        )}
                                    </TableCell>
                                )
                            })}
                            {hasAnyCustom && (
                                <CustomPermissionsCell
                                    customPermissions={customPermissions}
                                    assignedPermissions={assignedPermissions}
                                    onCheck={onCheck}
                                />
                            )}
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default PermissionAssign
