import DitadsLogo from "@/components/ditads-logo";
import { Link } from "@inertiajs/react";

export default function AuthLayout({ children, title = "", description = "" }) {
    return (
        <div className="min-h-svh flex flex-col">
            <header className="h-16 container mx-auto flex items-center px-4">
                <Link href="/">
                    <div className="size-12">
                        <DitadsLogo />
                    </div>
                </Link>
            </header>
            <main className="flex-1 flex items-center justify-center">
                <div className="flex-1 flex flex-col gap-8 max-w-sm p-4">
                    <div className="space-y-1">
                        <h1 className="font-semibold text-2xl">{title}</h1>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}
