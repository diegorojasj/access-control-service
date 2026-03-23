import { TableCell, TableRow } from "@/components/ui/table"
import type { TodoType } from "../../infrastructure/todoType.infrastructure"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";

interface DraggableRowProps {
    task: TodoType
    onEdit: () => void
    onStatusChange: () => void
    onDelete: () => void
}

const TodoDraggableRow = ({ task, onEdit, onStatusChange, onDelete }: DraggableRowProps) => {
    const {
        setNodeRef,
        transform,
        transition,
        attributes,
        listeners,
    } = useSortable({ id: task.id as number })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const isPending = task.status == 1

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
        >
            <TableCell>{task.task}</TableCell>
            <TableCell><div className="max-w-[200px] whitespace-normal break-words">{task.description}</div></TableCell>
            <TableCell>{isPending ? "Pending" : "Completed"}</TableCell>
            <TableCell>{task.user?.name}</TableCell>
            <TableCell className="flex gap-2" onPointerDown={(e) => e.stopPropagation()}>
                <Button
                    size="sm"
                    variant="secondary"
                    className="bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                    onClick={onEdit}
                >
                    Edit
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    className={isPending
                        ? "bg-transparent border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                        : "bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-white"
                    }
                    onClick={onStatusChange}
                >
                    {isPending ? "Complete" : "Reopen"}
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={onDelete}
                >
                    Delete
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default TodoDraggableRow
