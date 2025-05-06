import { AppSidebar } from "@/components/app-sidebar";
import { useSecurity } from "@/components/security-modal";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

export default function AppLayout({ children, title = "" }) {
    const user = usePage().props.auth.user;
    const { setOpen } = useSecurity();
    const currentPath = usePage().url;

    useEffect(() => {
        if (user.is_default === 1 && currentPath !== "/settings/password") {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [user]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="h-16 px-4 shrink-0 grid grid-cols-2 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center justify-start gap-2">
                        <div className="-ml-1">
                            <SidebarTrigger />
                        </div>
                        <div className="mr-2 h-4">
                            <Separator orientation="vertical" />
                        </div>
                        <span className="font-medium break-words line-clamp-2">
                            {title}
                        </span>
                    </div>
                    <div className="flex items-center justify-end"></div>
                </header>
                <main className="container mx-auto p-4">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
