import { useQueryClient } from "@tanstack/react-query"
import { useMutateRequest } from "@/shared/useRequest"
import type { TodoType } from "../infrastructure/todoType.infrastructure"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sileo } from "sileo"
import { Spinner } from "@/components/ui/spinner"

const TodoForm = ({ todo, onSuccess }: { todo?: TodoType; onSuccess?: () => void }) => {
    const queryClient = useQueryClient()

    const request = useMutateRequest({
        url: todo ? "/todo/update" : "/todo/create",
        method: "POST",
    })

    const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget as typeof e.currentTarget & {
            task: HTMLInputElement
            description: HTMLInputElement
        }

        request.mutate(
            {
                id: todo?.id,
                task: form.task.value,
                description: form.description.value,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["todoList"] })
                    sileo.success({
                        title: todo ? "Todo updated" : "Todo created",
                        description: todo ? "The task has been updated." : "The task has been created.",
                    })
                    form.reset()
                    onSuccess?.()
                },
                onError: (error) => {
                    const err = error as Error & { detail?: string }
                    sileo.error({
                        title: todo ? "Update failed" : "Create failed",
                        description: err.message ?? err.detail,
                    })
                },
            }
        )
    }

    return (
        <div className="p-2">
            <form id="todo-form" onSubmit={onSubmit}>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="task" className="text-sm font-medium">Task</label>
                        <Input id="task" name="task" type="text" placeholder="Task name" defaultValue={todo?.task} required maxLength={50} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="description" className="text-sm font-medium">Description</label>
                        <Input id="description" name="description" type="text" placeholder="Description" defaultValue={todo?.description} required maxLength={255} />
                    </div>

                    <Button type="submit" form="todo-form" className="w-full" disabled={request.isPending}>
                        {request.isPending ? <Spinner /> : todo ? "Save changes" : "Create task"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default TodoForm
