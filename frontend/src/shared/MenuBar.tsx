import { useState } from "react"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import { AppStore } from "@/core/AppContext"
import { useNavigate } from "react-router-dom"
import { ChevronDown } from "lucide-react"

const MenuBar = () => {
    const {
        user,
        setOpenUserManagementTable,
        setOpenUserManagementForm,
        setOpenToDoListTable,
        setOpenToDoListForm,
        setOpenRoleManagementTable,
        setOpenRoleManagementForm,
    } = AppStore()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [expanded, setExpanded] = useState<string | null>(null)

    const handleItemClick = (onClick: () => void) => {
        onClick()
        setOpen(false)
        setExpanded(null)
    }

    const menuItems = [
        { label: "To Do List", children: [{ label: "New", onClick: () => setOpenToDoListForm(true) }, { label: "View", onClick: () => setOpenToDoListTable(true) }] },
        { label: "User Management", children: [{ label: "New", onClick: () => setOpenUserManagementForm(true) }, { label: "View", onClick: () => setOpenUserManagementTable(true) }] },
        { label: "Role Management", children: [{ label: "New", onClick: () => setOpenRoleManagementForm(true) }, { label: "View", onClick: () => setOpenRoleManagementTable(true) }] },
    ]

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:block">
                <Menubar>
                    {menuItems.map((item) => (
                        <MenubarMenu key={item.label}>
                            <MenubarTrigger>{item.label}</MenubarTrigger>
                            <MenubarContent>
                                {item.children.map((child) => (
                                    <MenubarItem key={child.label} onClick={child.onClick}>{child.label}</MenubarItem>
                                ))}
                            </MenubarContent>
                        </MenubarMenu>
                    ))}
                    <MenubarMenu>
                        <MenubarTrigger>{user?.name}({user?.roleName})</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem onClick={() => navigate("/logout")}>Logout</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>

            {/* Mobile */}
            <div className="md:hidden relative z-[9999]">
                <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-background">
                    <span className="text-sm font-medium">{user?.name}({user?.roleName})</span>
                    <button
                        onClick={() => {
                            setOpen((v) => !v)
                            if (open) handleItemClick(() => { })
                        }}
                        className="text-lg leading-none pl-2 cursor-pointer"
                        aria-label="Toggle menu"
                        aria-expanded={open}
                    >
                        <span className={`inline-block transition-all duration-200 ${open ? "rotate-90 opacity-80" : "rotate-0 opacity-100"}`}>
                            {open ? "✕" : "☰"}
                        </span>
                    </button>
                </div>

                <div
                    className={`
                        absolute w-full mt-1 border rounded-md bg-background shadow-lg overflow-hidden
                        transition-all duration-200 origin-top
                        ${open ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"}
                    `}
                >
                    {menuItems.map((item) => {
                        const isExpanded = expanded === item.label
                        return (
                            <div key={item.label} className="border-b last:border-b-0">
                                <button
                                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-accent active:bg-accent transition-colors duration-150 cursor-pointer"
                                    onClick={() => setExpanded(isExpanded ? null : item.label)}
                                >
                                    <span>{item.label}</span>
                                    <ChevronDown size={14} strokeWidth={2.5} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`} />
                                </button>
                                <div
                                    className={`
                                        overflow-hidden transition-all duration-200 ease-in-out
                                        ${isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
                                    `}
                                >
                                    <div className="py-1 px-2">
                                        {item.children.map((child) => (
                                            <button
                                                key={child.label}
                                                className="w-full text-left px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground active:scale-[0.98] transition-all duration-150 cursor-pointer"
                                                onClick={() => handleItemClick(child.onClick)}
                                            >
                                                {child.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <button
                        className="w-full text-left px-4 py-3 text-sm hover:bg-accent active:bg-accent transition-colors duration-150 text-destructive cursor-pointer"
                        onClick={() => navigate("/logout")}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    )
}

export default MenuBar
