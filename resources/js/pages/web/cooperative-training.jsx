
import WebLayout from "@/layouts/web-layout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import Img1 from "../../../../public/images/cooperative-training/1.jpg";
import Img2 from "../../../../public/images/cooperative-training/2.jpg";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import InputError from "@/components/input-error";

import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileImage,
    GraduationCap,
    Handshake,
    ImagePlus,
    LoaderCircle,
    Users,
    X,
} from "lucide-react";
import { toast } from "sonner";

const initialForm = {
    training_id: null,
    event_name: "",
    from_date: null,
    to_date: null,
    last_name: "",
    first_name: "",
    middle_name: "",
    email: "",
    birth_date: null,
    gender: "",
    cooperative_name: "",
    proof_payment: null,
};

const formatDate = (date) => {
    if (!date) return "Date to be announced";

    const parsedDate = typeof date === "string" ? parseISO(date) : new Date(date);

    if (!isValid(parsedDate)) return "Date to be announced";

    return format(parsedDate, "MMMM dd, yyyy");
};

const formatDateRange = (from, to) => {
    if (!from) return "Schedule to be announced";

    const startDate = typeof from === "string" ? parseISO(from) : new Date(from);
    const endDate = to ? (typeof to === "string" ? parseISO(to) : new Date(to)) : startDate;

    if (!isValid(startDate)) return "Schedule to be announced";

    if (!isValid(endDate) || format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd")) {
        return format(startDate, "MMMM dd, yyyy");
    }

    if (format(startDate, "yyyy") === format(endDate, "yyyy")) {
        return `${format(startDate, "MMM dd")} – ${format(endDate, "MMM dd, yyyy")}`;
    }

    return `${format(startDate, "MMM dd, yyyy")} – ${format(endDate, "MMM dd, yyyy")}`;
};

const getDateParts = (date) => {
    if (!date) return { month: "TBA", day: "--", year: "" };

    const parsedDate = typeof date === "string" ? parseISO(date) : new Date(date);

    if (!isValid(parsedDate)) return { month: "TBA", day: "--", year: "" };

    return {
        month: format(parsedDate, "MMM"),
        day: format(parsedDate, "dd"),
        year: format(parsedDate, "yyyy"),
    };
};

export default function CooperativeTraining() {
    const { trainings = [] } = usePage().props;

    const [open, setOpen] = useState(false);
    const [previewProof, setPreviewProof] = useState(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        clearErrors,
        reset,
    } = useForm(initialForm);

    useEffect(() => {
        return () => {
            if (previewProof) {
                URL.revokeObjectURL(previewProof);
            }
        };
    }, [previewProof]);

    const clearPreview = () => {
        setPreviewProof((current) => {
            if (current) URL.revokeObjectURL(current);
            return null;
        });
    };

    const resetForm = () => {
        clearPreview();
        reset();
        clearErrors();
    };

    const handleOpen = (training) => {
        resetForm();

        if (training) {
            setData({
                ...initialForm,
                training_id: training.id,
                event_name: training.event_name || "",
                from_date: training.from_date || null,
                to_date: training.to_date || null,
            });
        }

        setOpen(true);
    };

    const handleClose = (value) => {
        if (processing) return;

        setOpen(value);

        if (!value) {
            resetForm();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            setData("proof_payment", null);
            clearPreview();
            return;
        }

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            toast.error("Please upload a JPG or PNG image.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("The payment proof must not exceed 5 MB.");
            event.target.value = "";
            return;
        }

        setData("proof_payment", file);
        clearPreview();
        setPreviewProof(URL.createObjectURL(file));
        clearErrors("proof_payment");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (processing) return;

        clearErrors();

        post("/cooperative-training-service/submit", {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                resetForm();
                toast.success("Inquiry submitted successfully.");
            },
            onError: () => {
                toast.error("Please check the form and correct the errors.");
            },
        });
    };

    return (
        <>
            <Head title="Cooperative Training Service">
                <meta
                    name="description"
                    content="Explore cooperative training programs, schedules, and registration opportunities offered by DIT.ADS."
                />
            </Head>

            <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        <GraduationCap className="size-4" />
                        Learning and Development
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Cooperative Training Service
                    </h1>

                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                        Empower your cooperative through meaningful learning
                        experiences, practical training programs, and
                        professional development opportunities.
                    </p>
                </div>

                <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="overflow-hidden rounded-2xl bg-muted">
                                <img
                                    src={Img1}
                                    alt="Cooperative training activity"
                                    className="h-full min-h-48 w-full object-cover transition-transform duration-500 hover:scale-105 sm:min-h-64"
                                />
                            </div>

                            <div className="mt-8 overflow-hidden rounded-2xl bg-muted">
                                <img
                                    src={Img2}
                                    alt="Cooperative learning and development"
                                    className="h-full min-h-48 w-full object-cover transition-transform duration-500 hover:scale-105 sm:min-h-64"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                                <Handshake className="size-5" />
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    Building stronger cooperatives
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Develop skills. Strengthen your organization.
                            </h2>

                            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Discover training opportunities designed to
                                support cooperative members and organizations.
                                Browse the available schedules, review the
                                program details, and submit your inquiry to
                                participate.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Users className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">
                                        Collaborative Learning
                                    </h3>
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                        Learn and grow through cooperative
                                        development activities.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <GraduationCap className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">
                                        Professional Development
                                    </h3>
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                        Explore opportunities to enhance
                                        knowledge and skills.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-end justify-between gap-4 border-b pb-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-primary">
                                    <CalendarDays className="size-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">
                                        Upcoming opportunities
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    Training Schedule
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Browse our available training programs.
                                </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                                {trainings.length}{" "}
                                {trainings.length === 1 ? "Program" : "Programs"}
                            </span>
                        </div>

                        {trainings.length > 0 ? (
                            <Accordion
                                type="single"
                                collapsible
                                className="space-y-3"
                            >
                                {trainings.map((training) => {
                                    const date = getDateParts(training.from_date);

                                    return (
                                        <AccordionItem
                                            key={training.id}
                                            value={String(training.id)}
                                            className="overflow-hidden rounded-xl border bg-card px-4 shadow-sm transition-shadow hover:shadow-md sm:px-5"
                                        >
                                            <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
                                                <div className="flex min-w-0 items-center gap-4">
                                                    <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        <span className="text-[10px] font-bold uppercase">
                                                            {date.month}
                                                        </span>
                                                        <span className="text-xl font-bold leading-tight">
                                                            {date.day}
                                                        </span>
                                                        <span className="text-[10px]">
                                                            {date.year}
                                                        </span>
                                                    </div>

                                                    <div className="min-w-0 space-y-1">
                                                        <p className="text-xs font-medium text-primary">
                                                            {formatDateRange(
                                                                training.from_date,
                                                                training.to_date
                                                            )}
                                                        </p>
                                                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
                                                            {training.event_name}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>

                                            <AccordionContent>
                                                <div className="space-y-5 border-t pt-4">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Clock3 className="size-4 text-primary" />
                                                        {formatDateRange(
                                                            training.from_date,
                                                            training.to_date
                                                        )}
                                                    </div>

                                                    <div className="prose prose-sm max-w-none break-words text-foreground dark:prose-invert">
                                                        <FroalaEditorView
                                                            model={
                                                                training.description ||
                                                                ""
                                                            }
                                                        />
                                                    </div>

                                                    <div className="flex justify-end">
                                                        <Button
                                                            onClick={() =>
                                                                handleOpen(training)
                                                            }
                                                            className="rounded-lg"
                                                        >
                                                            Inquire Now
                                                            <ArrowRight className="ml-2 size-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        ) : (
                            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-8 text-center">
                                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <CalendarDays className="size-7" />
                                </div>
                                <h3 className="font-semibold">
                                    No Training Schedule Available
                                </h3>
                                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                    There are currently no training programs
                                    available. Please check back later for
                                    upcoming schedules.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="max-h-[90svh] overflow-y-auto p-0 sm:max-w-2xl">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6 p-5 sm:p-7">
                            <DialogHeader>
                                <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <GraduationCap className="size-6" />
                                </div>

                                <DialogTitle className="text-xl font-bold">
                                    Training Inquiry
                                </DialogTitle>

                                <DialogDescription>
                                    Complete the form below to submit your
                                    inquiry for this training program.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="rounded-xl border bg-muted/30 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                                    Selected Training
                                </p>
                                <h3 className="mt-1 font-semibold">
                                    {data.event_name}
                                </h3>
                                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                    <CalendarDays className="size-4" />
                                    {formatDateRange(
                                        data.from_date,
                                        data.to_date
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold">
                                        Personal Information
                                    </h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Enter your personal details.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="last_name"
                                            autoComplete="family-name"
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData("last_name", e.target.value)
                                            }
                                            placeholder="Enter last name"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.last_name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">
                                            First Name
                                        </Label>
                                        <Input
                                            id="first_name"
                                            autoComplete="given-name"
                                            value={data.first_name}
                                            onChange={(e) =>
                                                setData("first_name", e.target.value)
                                            }
                                            placeholder="Enter first name"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.first_name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="middle_name">
                                            Middle Name
                                            <span className="ml-1 text-xs font-normal text-muted-foreground">
                                                (Optional)
                                            </span>
                                        </Label>
                                        <Input
                                            id="middle_name"
                                            value={data.middle_name}
                                            onChange={(e) =>
                                                setData("middle_name", e.target.value)
                                            }
                                            placeholder="Enter middle name"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.middle_name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email Address
                                            <span className="ml-1 text-xs font-normal text-muted-foreground">
                                                (Optional)
                                            </span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="name@example.com"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="birth_date">
                                            Birth Date
                                        </Label>
                                        <Input
                                            id="birth_date"
                                            type="date"
                                            value={data.birth_date || ""}
                                            onChange={(e) =>
                                                setData("birth_date", e.target.value)
                                            }
                                            disabled={processing}
                                        />
                                        <InputError message={errors.birth_date} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select
                                            value={data.gender}
                                            onValueChange={(value) =>
                                                setData("gender", value)
                                            }
                                            disabled={processing}
                                        >
                                            <SelectTrigger id="gender">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">
                                                    Male
                                                </SelectItem>
                                                <SelectItem value="female">
                                                    Female
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.gender} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-5">
                                <div>
                                    <h3 className="text-sm font-semibold">
                                        Cooperative Information
                                    </h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Provide the name of your cooperative.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cooperative_name">
                                        Cooperative Name
                                    </Label>
                                    <Input
                                        id="cooperative_name"
                                        value={data.cooperative_name}
                                        onChange={(e) =>
                                            setData(
                                                "cooperative_name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter cooperative name"
                                        disabled={processing}
                                    />
                                    <InputError
                                        message={errors.cooperative_name}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-5">
                                <div>
                                    <h3 className="text-sm font-semibold">
                                        Proof of Payment
                                    </h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Upload your payment receipt in JPG or
                                        PNG format, up to 5 MB.
                                    </p>
                                </div>

                                <input
                                    id="proof_payment"
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    onChange={handleFileChange}
                                    className="sr-only"
                                    disabled={processing}
                                />

                                <label
                                    htmlFor="proof_payment"
                                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                                        processing
                                            ? "cursor-not-allowed opacity-50"
                                            : "hover:border-primary hover:bg-primary/5"
                                    }`}
                                >
                                    <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <ImagePlus className="size-6" />
                                    </div>
                                    <span className="text-sm font-semibold">
                                        Choose payment receipt
                                    </span>
                                    <span className="mt-1 text-xs text-muted-foreground">
                                        JPG or PNG · Maximum 5 MB
                                    </span>
                                </label>

                                {data.proof_payment && (
                                    <div className="flex items-center gap-3 rounded-lg border p-3">
                                        <FileImage className="size-5 shrink-0 text-primary" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {data.proof_payment.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {(
                                                    data.proof_payment.size /
                                                    (1024 * 1024)
                                                ).toFixed(2)}{" "}
                                                MB
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0"
                                            disabled={processing}
                                            onClick={() => {
                                                setData("proof_payment", null);
                                                clearPreview();

                                                const input =
                                                    document.getElementById(
                                                        "proof_payment"
                                                    );

                                                if (input) input.value = "";
                                            }}
                                        >
                                            <X className="size-4" />
                                            <span className="sr-only">
                                                Remove uploaded file
                                            </span>
                                        </Button>
                                    </div>
                                )}

                                {previewProof && (
                                    <div className="overflow-hidden rounded-xl border bg-muted/20 p-2">
                                        <img
                                            src={previewProof}
                                            alt="Payment proof preview"
                                            className="mx-auto max-h-64 w-full rounded-lg object-contain"
                                        />
                                    </div>
                                )}

                                <InputError message={errors.proof_payment} />
                            </div>

                            <DialogFooter className="gap-2 border-t pt-5 sm:gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={processing}
                                    onClick={() => handleClose(false)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="min-w-36"
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="mr-2 size-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Inquiry
                                            <ArrowRight className="ml-2 size-4" />
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

CooperativeTraining.layout = (page) => (
    <WebLayout children={page} />
);
