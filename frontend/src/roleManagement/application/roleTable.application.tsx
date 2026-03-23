import DraggableModal from "@/shared/DraggableModal"
import RoleTable from "../presentation/roleTable.presentation"
import { AppStore } from "@/core/AppContext"

const RoleTableApplication = () => {
    const { openRoleManagementTable: open, setOpenRoleManagementTable } = AppStore()
    const onClose = () => {
        setOpenRoleManagementTable(false)
    }
    return (
        <DraggableModal title="Role View" width={800} backdrop={false} open={open} onClose={onClose}>
            <RoleTable />
        </DraggableModal>
    )
}

export default RoleTableApplication
