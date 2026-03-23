import DraggableModal from "@/shared/DraggableModal"
import PermissionForm from "../presentation/permissionForm.presentation"
import { AppStore } from "@/core/AppContext"

const PermissionFormApplication = () => {
    const { openPermissionManagementForm: open, setOpenPermissionManagementForm } = AppStore()
    const onClose = () => {
        setOpenPermissionManagementForm(false)
    }
    return (
        <DraggableModal title="New Permission" width={600} backdrop={false} open={open} onClose={onClose}>
            <PermissionForm onSuccess={onClose} />
        </DraggableModal>
    )
}

export default PermissionFormApplication
