import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/auth-layout";
import { Link, useForm } from "@inertiajs/react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const handleSend = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <AuthLayout
            title="Verify email"
            description="Please verify your email address by clicking on the link we just emailed to you."
        >
            <form onSubmit={handleSend} className="space-y-6">
                {status === "verification-link-sent" && (
                    <Alert className="border-primary">
                        <AlertDescription className="text-primary">
                            A new verification link has been sent to the email
                            address you provided during registration.
                        </AlertDescription>
                    </Alert>
                )}
                <Button
                    variant="secondary"
                    className="w-full"
                    disabled={processing}
                >
                    Resend verification email
                </Button>
                <Link
                    href="/logout"
                    method="post"
                    className="mx-auto block text-sm hover:underline"
                >
                    Log out
                </Link>
            </form>
        </AuthLayout>
    );
}
