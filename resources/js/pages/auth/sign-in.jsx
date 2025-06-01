import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useForm } from "@inertiajs/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InputError from "@/components/input-error";
import AuthLayout from "@/layouts/auth-layout";
import InputPassword from "@/components/input-password";
import { Loader } from "lucide-react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleLogin = (e) => {
        e.preventDefault();
        clearErrors();
        post(route("login"));
    };

    return (
        <AuthLayout title="Welcome back" description="Sign in to your account">
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                    {status && (
                        <Alert className="border-primary">
                            <AlertDescription className="text-primary">
                                {status}
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-1">
                        <Label>Email address</Label>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div className="space-y-1">
                        <Label>Password</Label>
                        <InputPassword
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <InputError message={errors.password} />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                checked={data.remember}
                                onCheckedChange={(val) =>
                                    setData("remember", val)
                                }
                                id="remember"
                            />
                            <Label htmlFor="remember">Remember me</Label>
                        </div>
                        {canResetPassword && (
                            <Link href={route("password.request")}>
                                <Label>Forgot password?</Label>
                            </Link>
                        )}
                    </div>
                </div>
                <Button className="w-full" disabled={processing}>
                    {processing && <Loader className="animate-spin" />}
                    {processing ? "Logging in" : "Log in"}
                </Button>
                {/* <div className="text-muted-foreground text-center text-sm">
                    Don't have an account?{" "}
                    <Link href={route("register")} className="hover:underline">
                        Sign up
                    </Link>
                </div> */}
            </form>
        </AuthLayout>
    );
}
