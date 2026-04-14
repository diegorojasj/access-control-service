import { memo } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import type { TodoType } from "@/todoList/infrastructure/todoType.infrastructure"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

interface DraggableRowProps {
    task: TodoType
    onEdit: (todo: TodoType) => void
    onStatusChange: (todo: TodoType) => void
    onDelete: (todo: TodoType) => void
    editPermission: boolean
    deletePermission: boolean
    checkPermission: boolean
    uncheckPermission: boolean
}

const TodoDraggableRow = memo(({ task, onEdit, onStatusChange, onDelete, editPermission, deletePermission, checkPermission, uncheckPermission }: DraggableRowProps) => {
    const {
        setNodeRef,
        transform,
        transition,
        attributes,
        listeners,
    } = useSortable({ id: task.id as number })

    const isPending = task.status == 1

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
        >
            <TableCell className="cursor-grab text-muted-foreground" {...listeners}>
                <GripVertical size={16} />
            </TableCell>
            <TableCell>{task.task}</TableCell>
            <TableCell><div className="whitespace-normal break-words">{task.description}</div></TableCell>
            <TableCell>{isPending ? "Pending" : "Completed"}</TableCell>
            <TableCell>{task.user?.name}</TableCell>
            <TableCell className="flex flex-wrap gap-1" onPointerDown={(e) => e.stopPropagation()}>
                {editPermission && <Button
                    size="sm"
                    variant="secondary"
                    className="bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-2 text-xs"
                    onClick={() => onEdit(task)}
                >
                    Edit
                </Button>}
                {((checkPermission && isPending) || (uncheckPermission && !isPending)) && <Button
                    size="sm"
                    variant="secondary"
                    className={isPending
                        ? "bg-transparent border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-2 text-xs"
                        : "bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-white px-2 text-xs"
                    }
                    onClick={() => onStatusChange(task)}
                >
                    {isPending ? "Complete" : "Reopen"}
                </Button>}
                {deletePermission && <Button
                    size="sm"
                    variant="secondary"
                    className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-2 text-xs"
                    onClick={() => onDelete(task)}
                >
                    Delete
                </Button>}
            </TableCell>
        </TableRow>
    )
})

TodoDraggableRow.displayName = "TodoDraggableRow"

export default TodoDraggableRow
