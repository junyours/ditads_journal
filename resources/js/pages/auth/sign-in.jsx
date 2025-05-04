import AuthLayout from "@/layouts/auth-layout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import InputPassword from "@/components/input-password";
import { toast } from "sonner";

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export default function SignIn() {
    const [processing, setProcessing] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values) => {
        setProcessing(true);
        router.post("/sign-in", values, {
            onError: (error) => {
                toast.error(error.email);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-end">
                                <FormLabel>Password</FormLabel>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium hover:underline"
                                    tabIndex={-1}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <FormControl>
                                <InputPassword {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={processing}>Sign in</Button>
            </form>
        </Form>
    );
}

SignIn.layout = (page) => (
    <AuthLayout
        children={page}
        title="Welcome back"
        description="Sign in to your account"
    />
);
