import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

export default function AccountLayout({ children }) {
    return (
        <div className="flex gap-4">
            <div className="w-full max-w-80 p-4 space-y-1">
                <Button
                    onClick={() => router.visit("/account/profile")}
                    variant="outline"
                    className="justify-start w-full"
                >
                    My Profile
                </Button>
                <Button
                    onClick={() => router.visit("/account/orders")}
                    variant="outline"
                    className="justify-start w-full"
                >
                    My Orders
                </Button>
            </div>
            <div className="flex-1 p-4">
                <div className="bg-background rounded-xl">{children}</div>
            </div>
        </div>
    );
}
