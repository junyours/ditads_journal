import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import SettingLayout from "@/layouts/setting-layout";
import { usePage } from "@inertiajs/react";

export default function Profile() {
    const user = usePage().props.auth.user;

    return (
        <div className="space-y-4">
            <h1 className="mb-0.5 text-base font-medium">
                Profile Information
            </h1>
            <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Name</Label>
                        <Input value={user.name} readOnly />
                    </div>
                    <div className="space-y-1">
                        <Label>Email address</Label>
                        <Input value={user.email} readOnly />
                    </div>
                </div>
            </div>
        </div>
    );
}

Profile.layout = (page) => (
    <AppLayout title="Settings">
        <SettingLayout children={page} />
    </AppLayout>
);
