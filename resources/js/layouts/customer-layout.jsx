import DitadsLogo from "@/components/ditads-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, router } from "@inertiajs/react";
import { Heart, Search, ShoppingCart } from "lucide-react";

export default function CustomerLayout({ children }) {
    return (
        <>
            <div className="h-12 border-b bg-muted px-4 grid grid-cols-2 items-center gap-2">
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
                    <Link
                        href="/logout"
                        method="post"
                        className="font-medium text-sm hover:underline"
                    >
                        Sign Out
                    </Link>
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
                                className="max-w-72 rounded-r-none"
                                placeholder="Search for ISBN, Title, Author/s..."
                            />
                            <Button size="icon" className="rounded-l-none">
                                <Search />
                            </Button>
                        </div>
                        <Button size="icon" variant="outline">
                            <Heart />
                        </Button>
                        <Button
                            onClick={() => router.visit("/cart")}
                            size="icon"
                            variant="outline"
                        >
                            <ShoppingCart />
                        </Button>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto p-4">{children}</main>
        </>
    );
}
