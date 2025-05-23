import DitadsLogo from "@/components/ditads-logo";
import { Link } from "@inertiajs/react";

export default function AuthLayout({ children, title = "", description = "" }) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href="/"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex size-20 items-center justify-center">
                                <DitadsLogo />
                            </div>
                        </Link>
                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-center text-sm">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
