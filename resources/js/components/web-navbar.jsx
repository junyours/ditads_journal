import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, usePage } from "@inertiajs/react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "./ui/button";

const items = [
    {
        title: "Home",
        url: "/",
    },
    {
        title: "About Us",
        url: "/about-us",
    },
    {
        title: "Book Publication",
        url: "/book-publication",
    },
    {
        title: "Magazine",
        url: "/magazine",
    },
    {
        title: "Research Journal",
        url: "/research-journal",
    },
    {
        title: "Contact Us",
        url: "/contact-us",
    },
];

export default function WebNavbar({ open, onOpenChange }) {
    const isMobile = useIsMobile();
    const user = usePage().props.auth.user;
    const currentPath = window.location.pathname;

    return (
        <div className="flex justify-center">
            {isMobile ? (
                <Drawer open={open} onOpenChange={onOpenChange}>
                    <DrawerContent>
                        <div className="p-2 space-y-2">
                            {items.map((item) => (
                                <Link key={item.title} href={item.url}>
                                    <Button
                                        onClick={() => {
                                            if (isMobile) {
                                                onOpenChange(false);
                                            }
                                        }}
                                        key={item.title}
                                        variant="ghost"
                                        className={`justify-center w-full ${
                                            currentPath === item.url
                                                ? "text-primary"
                                                : ""
                                        }`}
                                    >
                                        {item.title}
                                    </Button>
                                </Link>
                            ))}
                            {user ? (
                                <div className="grid">
                                    <Link href={`/${user.role}/dashboard`}>
                                        <Button
                                            onClick={() => {
                                                if (isMobile) {
                                                    onOpenChange(false);
                                                }
                                            }}
                                            className="w-full"
                                        >
                                            Dashboard
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <Link href="/sign-in">
                                        <Button
                                            onClick={() => {
                                                if (isMobile) {
                                                    onOpenChange(false);
                                                }
                                            }}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Sign in
                                        </Button>
                                    </Link>
                                    <Link href="/sign-up">
                                        <Button
                                            onClick={() => {
                                                if (isMobile) {
                                                    onOpenChange(false);
                                                }
                                            }}
                                            className="w-full"
                                        >
                                            Join us
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </DrawerContent>
                </Drawer>
            ) : (
                <NavigationMenu>
                    <NavigationMenuList>
                        {items.map((item) => (
                            <NavigationMenuItem key={item.title}>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle({
                                        className:
                                            currentPath === item.url
                                                ? "text-primary hover:text-primary focus:text-primary"
                                                : "",
                                    })}
                                >
                                    <Link href={item.url}>{item.title}</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
            )}
        </div>
    );
}
