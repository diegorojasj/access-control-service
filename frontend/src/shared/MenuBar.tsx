import { useState } from "react"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import { AppStore } from "@/core/AppContext"
import { useNavigate } from "react-router-dom"

const MenuBar = () => {
    const { user, setOpenUserManagementTable, setOpenUserManagementForm } = AppStore()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [expanded, setExpanded] = useState<string | null>(null)

    const menuItems = [
        { label: "To Do List", children: [{ label: "New", onClick: undefined }, { label: "View", onClick: undefined }] },
        { label: "User Management", children: [{ label: "New", onClick: () => setOpenUserManagementForm(true) }, { label: "View", onClick: () => setOpenUserManagementTable(true) }] },
        { label: "Role Management", children: [{ label: "New", onClick: undefined }, { label: "View", onClick: undefined }] },
        { label: "Permission Management", children: [{ label: "New", onClick: undefined }, { label: "View", onClick: undefined }] },
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
            <div className="md:hidden">
                <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-background">
                    <span className="text-sm font-medium">{user?.name}({user?.roleName})</span>
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="text-lg leading-none pl-2"
                        aria-label="Toggle menu"
                    >
                        {open ? "✕" : "☰"}
                    </button>
                </div>

                {open && (
                    <div className="mt-1 border rounded-md bg-background shadow-md overflow-hidden">
                        {menuItems.map((item) => (
                            <div key={item.label} className="border-b last:border-b-0">
                                <button
                                    className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-accent"
                                    onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                                >
                                    {item.label}
                                </button>
                                {expanded === item.label && (
                                    <div className="bg-muted">
                                        {item.children.map((child) => (
                                            <button
                                                key={child.label}
                                                className="w-full text-left px-8 py-2 text-sm hover:bg-accent"
                                                onClick={child.onClick}
                                            >
                                                {child.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            className="w-full text-left px-4 py-2 text-sm hover:bg-accent text-destructive"
                            onClick={() => navigate("/logout")}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default MenuBar
