import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@inertiajs/react";
import {
    BookOpenText,
    BookText,
    ChevronRight,
    FileText,
    LayoutDashboard,
    NotebookPen,
    School,
    Users,
} from "lucide-react";

const navAdmin = [
    {
        name: "Main",
        items: [
            {
                title: "Dashboard",
                url: "/admin/dashboard",
                icon: LayoutDashboard,
                collapse: false,
            },
            {
                title: "Users",
                url: "/admin/users",
                icon: Users,
                collapse: true,
                subitems: [
                    {
                        title: "Editor",
                        url: "/editor",
                    },
                    {
                        title: "Author",
                        url: "/author",
                    },
                ],
            },
        ],
    },
    {
        name: "Web",
        items: [
            {
                title: "Book Publication",
                url: "/admin/web/book-publication",
                icon: BookText,
                collapse: false,
            },
            {
                title: "Magazine",
                url: "/admin/web/magazine",
                icon: BookOpenText,
                collapse: false,
            },
            {
                title: "Research Journal",
                url: "/admin/web/research-journal",
                icon: FileText,
                collapse: false,
            },
        ],
    },
    {
        name: "Others",
        items: [
            {
                title: "Schools",
                url: "/admin/others/schools",
                icon: School,
                collapse: false,
            },
        ],
    },
];

const navEditor = [];

const navAuthor = [
    {
        name: "Main",
        items: [
            {
                title: "Dashboard",
                url: "/author/dashboard",
                icon: LayoutDashboard,
                collapse: false,
            },
        ],
    },
    {
        name: "Journal",
        items: [
            {
                title: "Requests",
                url: "/author/journal/requests",
                icon: NotebookPen,
                collapse: false,
            },
        ],
    },
];

export function NavItem({ user }) {
    const { setOpenMobile } = useSidebar();
    const isMobile = useIsMobile();
    const currentPath = window.location.pathname;

    const navGroups =
        (user.role === "admin" && navAdmin) ||
        (user.role === "editor" && navEditor) ||
        (user.role === "author" && navAuthor);

    return navGroups.map((group) => (
        <SidebarGroup key={group.name}>
            <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
            <SidebarMenu>
                {group.items.map((item) =>
                    item.collapse ? (
                        <Collapsible
                            key={item.title}
                            asChild
                            className="group/collapsible"
                            defaultOpen={
                                currentPath.startsWith(item.url) ? true : false
                            }
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.subitems?.map((subitem) => (
                                            <SidebarMenuSubItem
                                                key={subitem.title}
                                                onClick={() => {
                                                    if (isMobile) {
                                                        setOpenMobile(false);
                                                    }
                                                }}
                                            >
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={
                                                        currentPath.startsWith(
                                                            item.url +
                                                                subitem.url
                                                        )
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <Link
                                                        href={
                                                            item.url +
                                                            subitem.url
                                                        }
                                                    >
                                                        <span>
                                                            {subitem.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        <SidebarMenuItem
                            key={item.title}
                            onClick={() => {
                                if (isMobile) {
                                    setOpenMobile(false);
                                }
                            }}
                        >
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={
                                    currentPath.startsWith(item.url)
                                        ? true
                                        : false
                                }
                            >
                                <Link href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                )}
            </SidebarMenu>
        </SidebarGroup>
    ));
}
