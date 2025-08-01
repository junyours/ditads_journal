import DitadsLogo from "@/components/ditads-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, router, usePage } from "@inertiajs/react";
import { Search, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import User from "../../../public/images/user.png";
import { useState } from "react";

export default function CustomerLayout({ children }) {
    const { cartCount } = usePage().props;
    const params = new URLSearchParams(window.location.search);
    const user = usePage().props.auth.user;
    const [search, setSearch] = useState(params.get("search") || "");

    const handleSearch = () => {
        router.get("books", { search });
    };

    return (
        <div className="min-h-screen bg-muted">
            <div className="h-12 border-b px-4 grid grid-cols-2 items-center gap-2">
                <div className="flex items-center gap-1 text-sm">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex aspect-square size-8 items-center justify-center">
                            <DitadsLogo />
                        </div>
                        <span className="font-bold">
                            {import.meta.env.VITE_APP_NAME}
                        </span>
                    </Link>
                </div>
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2">
                            <Avatar className="size-8 border border-blue-500">
                                <AvatarImage src={User} />
                            </Avatar>
                            <span className="text-sm">{user.name}</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() => router.visit("/account/profile")}
                            >
                                My Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => router.visit("/account/orders")}
                            >
                                My Orders
                            </DropdownMenuItem>
                            <Link
                                href="/logout"
                                method="post"
                                className="w-full"
                            >
                                <DropdownMenuItem>Sign Out</DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <header className="z-10 sticky top-0 bg-background border-b">
                <div className="h-16 px-4 max-w-7xl mx-auto  grid grid-cols-2 items-center gap-2">
                    <Link href="/books" className="size-fit">
                        <span className="italic underline">Book Store</span>
                    </Link>
                    <div className="flex items-center justify-end gap-2">
                        <div className="flex-1 flex justify-end">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-72 rounded-r-none"
                                placeholder="Search for ISBN, Title, Author/s..."
                            />
                            <Button
                                onClick={handleSearch}
                                size="icon"
                                className="rounded-l-none"
                            >
                                <Search />
                            </Button>
                        </div>
                        <div className="relative">
                            <Button
                                onClick={() => router.visit("/cart")}
                                size="icon"
                                variant="outline"
                            >
                                <ShoppingCart />
                            </Button>
                            {cartCount > 0 && (
                                <Badge
                                    className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1 tabular-nums flex justify-center"
                                    variant="destructive"
                                >
                                    {cartCount}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto">{children}</main>
        </div>
    );
}
