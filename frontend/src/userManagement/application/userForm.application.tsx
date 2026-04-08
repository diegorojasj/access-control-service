import DraggableModal from "@/shared/DraggableModal"
import UserForm from "@/userManagement/presentation/userForm.presentation"
import { AppStore } from "@/core/AppContext"

const UserFormApplication = () => {
    const { openUserManagementForm: open, setOpenUserManagementForm } = AppStore()
    const onClose = () => {
        setOpenUserManagementForm(false)
    }
    return <DraggableModal title="New User" width={1000} backdrop={false} open={open} onClose={onClose} >
        <UserForm />
    </DraggableModal>
}

export default UserFormApplication