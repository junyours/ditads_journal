import { Button } from "@/components/ui/button";

export default function AccountLayout({ children }) {
    return (
        <div className="flex gap-4">
            <div className="w-full max-w-80 p-4 space-y-1">
                <Button variant="outline" className="justify-start w-full">My Profile</Button>
                <Button variant="outline" className="justify-start w-full">My Orders</Button>
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
}
