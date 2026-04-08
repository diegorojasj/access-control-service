import { AppStore } from "@/core/AppContext"
import DraggableModal from "@/shared/DraggableModal"
import TodoListForm from "@/todoList/presentation/todoListForm.presentation"

const TodoListFormApplication = () => {
    const { openToDoListForm, setOpenToDoListForm } = AppStore()
    const onClose = () => {
        setOpenToDoListForm(false)
    }

    return <DraggableModal title="To Do Form" width={1000} backdrop={false} open={openToDoListForm} onClose={onClose} >
        <TodoListForm />
    </DraggableModal>
}

export default TodoListFormApplication