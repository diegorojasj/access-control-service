import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Checkbox } from "@/components/ui/checkbox"
import { TableCell } from "@/components/ui/table"
import { cn } from "@/shared/utils"

export type Props = {
    customPermissions: string[]
    assignedPermissions: string[]
    onCheck: (permissionName: string, action: "add" | "remove") => void
}

const CustomPermissionsCell = ({ customPermissions, assignedPermissions, onCheck }: {
    customPermissions: string[]
    assignedPermissions: string[]
    onCheck: Props["onCheck"]
}) => {
    if (customPermissions.length === 0) return <TableCell />

    const assignedCount = customPermissions.filter((p) => assignedPermissions.includes(p)).length

    return (
        <TableCell>
            <HoverCard openDelay={100} closeDelay={150}>
                <HoverCardTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors",
                            assignedCount > 0
                                ? "bg-primary/10 text-primary ring-primary/30"
                                : "bg-muted text-muted-foreground ring-border"
                        )}
                    >
                        {assignedCount}/{customPermissions.length}
                    </button>
                </HoverCardTrigger>
                <HoverCardContent
                    side="top"
                    align="center"
                    sideOffset={6}
                    className="z-[1600] w-auto min-w-[160px] p-3"
                >
                    <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Custom permissions
                    </p>
                    <div className="flex flex-col gap-2">
                        {customPermissions.map((p) => {
                            const action = p.split(":")[1] ?? ""
                            const checked = assignedPermissions.includes(p)
                            return (
                                <label
                                    key={p}
                                    className="flex cursor-pointer items-center gap-2 select-none"
                                >
                                    <Checkbox
                                        checked={checked}
                                        onCheckedChange={() => onCheck(p, checked ? "remove" : "add")}
                                    />
                                    <span className="text-sm capitalize">{action}</span>
                                </label>
                            )
                        })}
                    </div>
                </HoverCardContent>
            </HoverCard>
        </TableCell>
    )
}

export default CustomPermissionsCell