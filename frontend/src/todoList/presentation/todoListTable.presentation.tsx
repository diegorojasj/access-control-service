import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useAutoRequest, useMutateRequest } from "@/shared/useRequest"
import { useMemo, useState } from "react";
import type { TodoType } from "../infrastructure/todoType.infrastructure";
import TodoDraggableRow from "./todoListTableComponents/todoDraggableRow";
import TodoListForm from "./todoListForm.presentation";
import { ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";

const TodoListTable = () => {
    const [editTodo, setEditTodo] = useState<TodoType | "new" | null>(null)
    const queryClient = useQueryClient()

    const request = useAutoRequest<TodoType[]>({
        queryKey: ["todoList"],
        url: "/todo/list",
        method: "GET"
    })

    const updateOrderRequest = useMutateRequest({
        url: "/todo/update-order",
        method: "POST"
    })

    const deleteRequest = useMutateRequest({
        url: "/todo/delete",
        method: "POST"
    })

    const statusChangeRequest = useMutateRequest({
        url: "/todo/status-change",
        method: "POST"
    })

    const taskIds = useMemo(() => request.data?.map((task) => task.id) ?? [], [request.data])

    const onDrag = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id && request.data) {
            const oldIndex = request.data.findIndex((task) => task.id === active.id);
            const newIndex = request.data.findIndex((task) => task.id === over?.id);
            const newOrder = arrayMove(request.data, oldIndex, newIndex)

            const list: Record<number, number> = {}
            newOrder.forEach((task, ind) => {
                if (task.id) {
                    list[task.id] = ind
                }
            })
            updateOrderRequest.mutate({ list }, { onSuccess: () => request.refetch() })
        }
    }

    const onStatusChange = (todo: TodoType) => {
        const isPending = todo.status == 1
        sileo.action({
            title: isPending ? "Mark as completed?" : "Mark as pending?",
            description: isPending
                ? `"${todo.task}" will be marked as completed.`
                : `"${todo.task}" will be marked as pending.`,
            duration: null,
            button: {
                title: "Confirm",
                onClick: () => {
                    sileo.clear("bottom-center")
                    statusChangeRequest.mutate({ id: todo.id }, {
                        onSuccess: () => {
                            queryClient.invalidateQueries({ queryKey: ["todoList"] })
                            sileo.success({ title: "Status updated", description: "Task status has been changed." })
                        },
                        onError: (error) => {
                            const err = error as Error & { detail?: string }
                            sileo.error({ title: "Status change failed", description: err.message ?? err.detail })
                        }
                    })
                }
            }
        })
    }

    const onDelete = (todo: TodoType) => {
        sileo.action({
            title: "Delete task?",
            description: `"${todo.task}" will be permanently deleted.`,
            duration: null,
            button: {
                title: "Delete",
                onClick: () => {
                    sileo.clear("bottom-center")
                    deleteRequest.mutate({ id: todo.id }, {
                        onSuccess: () => {
                            queryClient.invalidateQueries({ queryKey: ["todoList"] })
                            sileo.success({ title: "Task deleted", description: "The task has been deleted." })
                        },
                        onError: (error) => {
                            const err = error as Error & { detail?: string }
                            sileo.error({ title: "Delete failed", description: err.message ?? err.detail })
                        }
                    })
                }
            }
        })
    }

    if (editTodo !== null) {
        return (
            <>
                <div className="flex items-center gap-1 mb-2">
                    <button
                        className="text-blue-400 hover:text-blue-600 flex items-center"
                        onClick={() => setEditTodo(null)}
                    >
                        <ArrowLeft strokeWidth={3} size={18} />
                    </button>
                    <span className="font-bold">{editTodo === "new" ? "New Task" : "Edit Task"}</span>
                </div>
                <TodoListForm
                    todo={editTodo === "new" ? undefined : editTodo}
                    onSuccess={() => setEditTodo(null)}
                />
            </>
        )
    }

    return (
        <div>
            <DndContext collisionDetection={closestCenter} onDragEnd={onDrag}>
                <Table>
                    <TableCaption>A list of tasks</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                        <TableBody>
                            {request.data?.map((task) => (
                                <TodoDraggableRow
                                    key={task.id}
                                    task={task}
                                    onEdit={() => setEditTodo(task)}
                                    onStatusChange={() => onStatusChange(task)}
                                    onDelete={() => onDelete(task)}
                                />
                            ))}
                        </TableBody>
                    </SortableContext>
                </Table>
            </DndContext>
        </div>
    )
}

export default TodoListTable
