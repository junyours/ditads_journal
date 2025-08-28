import DitadsLogo from "@/components/ditads-logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, usePage } from "@inertiajs/react";
import JournalLogo from "../../../public/images/journal-logo.png";

export default function AuthLayout({ children, title = "", description = "" }) {
    const isMobile = useIsMobile();
    const { url } = usePage();

    return isMobile ? (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href="/">
                            <div className="mb-1 flex size-20">
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
    ) : (
        <div className="min-h-svh flex">
            <div className="flex items-center justify-center border-r w-full max-w-lg p-20">
                <div className="flex-1 flex flex-col gap-8">
                    <div className="space-y-2">
                        <h1 className="text-xl font-semibold">{title}</h1>
                        <p className="text-muted-foreground text-sm">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
            <div className="bg-muted flex-1 flex items-center justify-center">
                {url === "/journal/sign-up" ? (
                    <Link href="/research-journal">
                        <img
                            src={JournalLogo}
                            alt="journal-logo"
                            className="size-96 object-contain"
                        />
                    </Link>
                ) : (
                    <Link href="/">
                        <div className="size-80">
                            <DitadsLogo />
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}
