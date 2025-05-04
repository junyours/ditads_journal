import { Link, usePage } from "@inertiajs/react";
import DitadsLogo from "./ditads-logo";
import WebNavbar from "./web-navbar";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function WebHeader() {
    const [open, setOpen] = useState(false);
    const user = usePage().props.auth.user;

    return (
        <header className="h-16 container mx-auto grid grid-cols-3 items-center px-4">
            <div className="flex justify-start">
                <Link href="/" className="flex items-center gap-2">
                    <div className="size-12">
                        <DitadsLogo />
                    </div>
                </Link>
            </div>
            <WebNavbar open={open} onOpenChange={() => setOpen(false)} />
            <div className="hidden max-md:flex justify-end">
                <Button
                    onClick={() => setOpen(true)}
                    size="icon"
                    variant="outline"
                >
                    <Menu />
                </Button>
            </div>
            <div className="hidden md:flex justify-end">
                {user ? (
                    <Link href={`/${user.role}/dashboard`}>
                        <Button>Dashboard</Button>
                    </Link>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link href="/sign-in">
                            <Button variant="outline">Sign in</Button>
                        </Link>
                        <Button>Get started</Button>
                    </div>
                )}
            </div>
        </header>
    );
}
