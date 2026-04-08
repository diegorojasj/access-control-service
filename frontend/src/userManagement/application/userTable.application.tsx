import DraggableModal from "@/shared/DraggableModal"
import UserTable from "@/userManagement/presentation/userTable.presentation"
import { AppStore } from "@/core/AppContext"

const UserTableApplication = () => {
    const { openUserManagementTable: open, setOpenUserManagementTable } = AppStore()
    const onClose = () => {
        setOpenUserManagementTable(false)
    }
    return <DraggableModal title="User View" width={1000} backdrop={false} open={open} onClose={onClose} >
        <UserTable />
    </DraggableModal>
}

export default UserTableApplication