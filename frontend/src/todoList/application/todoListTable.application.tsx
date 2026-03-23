import { AppStore } from "@/core/AppContext"
import DraggableModal from "@/shared/DraggableModal"
import TodoListTable from "../presentation/todoListTable.presentation"

const TodoListTableApplication = () => {
    const { openToDoListTable: open, setOpenToDoListTable } = AppStore()
    const onClose = () => {
        setOpenToDoListTable(false)
    }

    return <DraggableModal title="To Do View" width={1000} backdrop={false} open={open} onClose={onClose} >
        <TodoListTable />
    </DraggableModal>

}

export default TodoListTableApplication