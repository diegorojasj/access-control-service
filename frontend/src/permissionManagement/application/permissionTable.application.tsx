import DraggableModal from "@/shared/DraggableModal"
import PermissionTable from "../presentation/permissionTable.presentation"
import { AppStore } from "@/core/AppContext"

const PermissionTableApplication = () => {
    const { openPermissionManagementTable: open, setOpenPermissionManagementTable } = AppStore()
    const onClose = () => {
        setOpenPermissionManagementTable(false)
    }
    return (
        <DraggableModal title="Permission View" width={900} backdrop={false} open={open} onClose={onClose}>
            <PermissionTable />
        </DraggableModal>
    )
}

export default PermissionTableApplication
