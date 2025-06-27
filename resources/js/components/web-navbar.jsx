import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, usePage } from "@inertiajs/react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "./ui/button";
import IMRJ from "../../../public/images/imrj.png";
import JEBMPA from "../../../public/images/jebmpa.png";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
    {
        title: "Home",
        url: "/",
        collapse: false,
    },
    {
        title: "About Us",
        url: "/about-us",
        collapse: false,
    },
    {
        title: "Research Consultant",
        url: "/research-consultant",
        collapse: false,
    },
    {
        title: "Book Publication",
        url: "/book-publication",
        collapse: false,
    },
    {
        title: "Magazine",
        url: "/magazine",
        collapse: false,
    },
    {
        title: "Research Journal",
        collapse: true,
        items: [
            {
                title: "DIT.ADS International Multidisciplinary Research Journal",
                icon: IMRJ,
                url: "/research-journal/imrj",
            },
            {
                title: "DIT.ADS Journal of Economics, Business Management, and Public Administration",
                icon: JEBMPA,
                url: "/research-journal/jebmpa",
            },
        ],
    },
    {
        title: "Contact Us",
        url: "/contact-us",
        collapse: false,
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
                            {items.map((item, index) =>
                                item.collapse ? (
                                    <Accordion type="single" collapsible>
                                        <AccordionItem
                                            value={`item-${index}`}
                                            className="border-none"
                                        >
                                            <AccordionTrigger className="p-0 px-4 pb-2 focus:no-underline">
                                                {item.title}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {item.items.map((subItem) => (
                                                    <Link
                                                        key={subItem.title}
                                                        href={subItem.url}
                                                    >
                                                        <Button
                                                            key={subItem.title}
                                                            onClick={() => {
                                                                if (isMobile) {
                                                                    onOpenChange(
                                                                        false
                                                                    );
                                                                }
                                                            }}
                                                            variant="ghost"
                                                            className={`justify-start text-start text-wrap w-full ${
                                                                currentPath ===
                                                                subItem.url
                                                                    ? "text-primary"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {subItem.title}
                                                        </Button>
                                                    </Link>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ) : (
                                    <Link key={item.title} href={item.url}>
                                        <Button
                                            onClick={() => {
                                                if (isMobile) {
                                                    onOpenChange(false);
                                                }
                                            }}
                                            variant="ghost"
                                            className={`justify-start w-full ${
                                                currentPath === item.url
                                                    ? "text-primary"
                                                    : ""
                                            }`}
                                        >
                                            {item.title}
                                        </Button>
                                    </Link>
                                )
                            )}
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
                                    {/* {currentPath === "/book-publication" && (
                                        <Link href="/book/sign-up">
                                            <Button
                                                onClick={() => {
                                                    if (isMobile) {
                                                        onOpenChange(false);
                                                    }
                                                }}
                                                className="w-full"
                                            >
                                                Sign up
                                            </Button>
                                        </Link>
                                    )}
                                    {currentPath === "/research-journal" && (
                                        <Link href="/journal/sign-up">
                                            <Button
                                                onClick={() => {
                                                    if (isMobile) {
                                                        onOpenChange(false);
                                                    }
                                                }}
                                                className="w-full"
                                            >
                                                Sign up
                                            </Button>
                                        </Link>
                                    )} */}
                                </div>
                            )}
                        </div>
                    </DrawerContent>
                </Drawer>
            ) : (
                items.map((item) =>
                    item.collapse ? (
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem key={item.title}>
                                    <NavigationMenuTrigger>
                                        {item.title}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="grid w-[350px] gap-4 p-4">
                                            {item.items.map((subItem) => (
                                                <NavigationMenuLink
                                                    asChild
                                                    className={`flex items-center gap-2 text-sm hover:bg-muted p-2 rounded-lg ${
                                                        currentPath ===
                                                        subItem.url
                                                            ? "text-primary hover:text-primary focus:text-primary"
                                                            : ""
                                                    }`}
                                                >
                                                    <Link href={subItem.url}>
                                                        <div className="shrink-0 size-10">
                                                            <img
                                                                src={
                                                                    subItem.icon
                                                                }
                                                                alt={
                                                                    subItem.title
                                                                }
                                                                className="object-contain rounded-lg"
                                                            />
                                                        </div>
                                                        {subItem.title}
                                                    </Link>
                                                </NavigationMenuLink>
                                            ))}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    ) : (
                        <NavigationMenu>
                            <NavigationMenuList>
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
                                        <Link href={item.url}>
                                            {item.title}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    )
                )
            )}
        </div>
    );
}
