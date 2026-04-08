import DraggableModal from "@/shared/DraggableModal"
import RoleForm from "@/roleManagement/presentation/roleForm.presentation"
import { AppStore } from "@/core/AppContext"

const RoleFormApplication = () => {
    const { openRoleManagementForm: open, setOpenRoleManagementForm } = AppStore()
    const onClose = () => {
        setOpenRoleManagementForm(false)
    }
    return (
        <DraggableModal title="New Role" width={600} backdrop={false} open={open} onClose={onClose}>
            <RoleForm onSuccess={onClose} />
        </DraggableModal>
    )
}

export default RoleFormApplication
