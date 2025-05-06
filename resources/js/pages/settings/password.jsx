import InputError from "@/components/input-error";
import InputPassword from "@/components/input-password";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import SettingLayout from "@/layouts/setting-layout";
import { useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";

export default function Password() {
    const user = usePage().props.auth.user;
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            current_password: "",
            password: "",
            password_confirmation: "",
        });

    const handleUpdate = (e) => {
        e.preventDefault();
        clearErrors();
        post("/settings/password/update", {
            onSuccess: () => {
                reset();
                toast.success("Password updated successfully.");
            },
        });
    };

    return (
        <div className="space-y-4">
            <h1 className="mb-0.5 text-base font-medium">Update Password</h1>
            <form onSubmit={handleUpdate}>
                <div className="space-y-6">
                    <div className="space-y-4">
                        {user.is_default === 0 && (
                            <div className="grid sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label>Current password</Label>
                                    <InputPassword
                                        value={data.current_password}
                                        onChange={(e) =>
                                            setData(
                                                "current_password",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.current_password}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="grid sm:grid-cols-2">
                            <div className="space-y-1">
                                <Label>New password</Label>
                                <InputPassword
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <InputError message={errors.password} />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2">
                            <div className="space-y-1">
                                <Label>Confirm password</Label>
                                <InputPassword
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button disabled={processing}>Save changes</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

Password.layout = (page) => (
    <AppLayout title="Settings">
        <SettingLayout children={page} />
    </AppLayout>
);
