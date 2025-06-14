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
    BookHeart,
    BookOpenText,
    BookText,
    ChevronRight,
    CreditCard,
    FileInput,
    FileText,
    LayoutDashboard,
    NotebookPen,
    School,
    SendToBack,
    SquareLibrary,
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
                        title: "Consultant",
                        url: "/consultant",
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
        name: "Journal",
        items: [
            {
                title: "Requests",
                url: "/admin/journal/requests",
                icon: NotebookPen,
                collapse: false,
            },
            {
                title: "Assign Documents",
                url: "/admin/journal/assign-documents",
                icon: FileInput,
                collapse: true,
                subitems: [
                    {
                        title: "Me",
                        url: "/me",
                    },
                    {
                        title: "Editor",
                        url: "/editor",
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
                title: "Payment Methods",
                url: "/admin/others/payment-methods",
                icon: CreditCard,
                collapse: false,
            },
            {
                title: "Schools",
                url: "/admin/others/schools",
                icon: School,
                collapse: false,
            },
            {
                title: "Book Categories",
                url: "/admin/others/book-categories",
                icon: SquareLibrary,
                collapse: false,
            },
        ],
    },
];

const navEditor = [
    {
        name: "Main",
        items: [
            {
                title: "Dashboard",
                url: "/editor/dashboard",
                icon: LayoutDashboard,
                collapse: false,
            },
        ],
    },
    {
        name: "Journal",
        items: [
            {
                title: "Assign Documents",
                url: "/editor/journal/assign-documents",
                icon: FileInput,
                collapse: false,
            },
        ],
    },
];

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
                title: "My Requests",
                url: "/author/journal/requests",
                icon: NotebookPen,
                collapse: false,
            },
        ],
    },
];

const navCustomer = [
    {
        name: "Main",
        items: [
            {
                title: "Dashboard",
                url: "/customer/dashboard",
                icon: LayoutDashboard,
                collapse: false,
            },
        ],
    },
    {
        name: "Book",
        items: [
            {
                title: "For Sale Books",
                url: "/customer/book/sales",
                icon: BookText,
                collapse: false,
            },
            {
                title: "Purchase Books",
                url: "/customer/book/purchase",
                icon: BookHeart,
                collapse: false,
            },
        ],
    },
    {
        name: "Transaction",
        items: [
            {
                title: "Book Orders",
                url: "/customer/transaction/book-orders",
                icon: SendToBack,
                collapse: true,
                subitems: [
                    {
                        title: "Hard Bound",
                        url: "/hard-bound",
                    },
                ],
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
        (user.role === "author" && navAuthor) ||
        (user.role === "customer" && navCustomer);

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
