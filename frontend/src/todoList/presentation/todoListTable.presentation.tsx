import { Table, TableBody, TableCaption } from "@/components/ui/table"
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useAutoRequest, useMutateRequest } from "@/shared/useRequest"
import { useCallback, useMemo, useRef, useState } from "react";
import type { TodoType } from "@/todoList/infrastructure/todoType.infrastructure";
import TodoDraggableRow from "@/todoList/presentation/todoListTableComponents/todoDraggableRow";
import TodoListForm from "@/todoList/presentation/todoListForm.presentation";
import { ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { AppStore } from "@/core/AppContext";
import TodoColumns from "@/todoList/presentation/todoListTableComponents/todoColumns";

const TodoListTable = () => {
    const { permissions, requirePermission } = AppStore()
    const [editTodo, setEditTodo] = useState<TodoType | "new" | null>(null)
    const queryClient = useQueryClient()

    const [editPermission, deletePermission, checkPermission, uncheckPermission] = useMemo(() => {
        return [requirePermission('todo:update'), requirePermission('todo:delete'), requirePermission('todo:check'), requirePermission('todo:uncheck')]
    }, [permissions, requirePermission])

    const request = useAutoRequest<TodoType[]>({
        queryKey: ["todoList"],
        url: "/todo/list",
        method: "GET",
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

    const updateOrderRequestRef = useRef(updateOrderRequest)
    updateOrderRequestRef.current = updateOrderRequest

    const onDrag = useCallback((event: DragEndEvent) => {
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
            updateOrderRequestRef.current.mutate({ list }, { onSuccess: () => request.refetch() })
        }
    }, [request.data, request.refetch])

    const onEdit = useCallback((todo: TodoType) => {
        if(editPermission) setEditTodo(todo)
    }, [editPermission])

    const onStatusChange = useCallback((todo: TodoType) => {
        const isPending = todo.status == 1
        if((!checkPermission && !uncheckPermission) || (!uncheckPermission && !isPending) || (!checkPermission && isPending)) return
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
                            sileo.error({ title: "Status change failed", description: err.detail ?? err.message })
                        }
                    })
                }
            }
        })
    }, [checkPermission, uncheckPermission, statusChangeRequest, queryClient])

    const onDelete = useCallback((todo: TodoType) => {
        if(!deletePermission) return
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
                            sileo.error({ title: "Delete failed", description: err.detail ?? err.message })
                        }
                    })
                }
            }
        })
    }, [deletePermission, deleteRequest, queryClient])

    if (request.isLoading) {
        return <div className="flex justify-center p-8"><Spinner /></div>
    }

    if (request.isError) {
        return <div className="text-sm text-red-500 p-4">Failed to load tasks.</div>
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
        <div className="w-full min-w-0">
            <DndContext collisionDetection={closestCenter} onDragEnd={onDrag}>
                <Table className="table-fixed w-full">
                    <TableCaption>A list of tasks</TableCaption>
                    <TodoColumns />
                    <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                        <TableBody>
                            {request.data?.map((task) => (
                                <TodoDraggableRow
                                    key={task.id}
                                    task={task}
                                    onEdit={onEdit}
                                    onStatusChange={onStatusChange}
                                    onDelete={onDelete}
                                    editPermission={editPermission}
                                    deletePermission={deletePermission}
                                    checkPermission={checkPermission}
                                    uncheckPermission={uncheckPermission}
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
