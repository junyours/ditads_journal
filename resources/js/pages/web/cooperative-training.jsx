import WebLayout from "@/layouts/web-layout";
import { Head, useForm, usePage } from "@inertiajs/react";
import Img1 from "../../../../public/images/cooperative-training/1.jpg";
import Img2 from "../../../../public/images/cooperative-training/2.jpg";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import InputError from "@/components/input-error";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader, Upload } from "lucide-react";
import { toast } from "sonner";

export default function CooperativeTraining() {
    const { trainings } = usePage().props;
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, clearErrors } = useForm({
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
    });
    const [previewProof, setPreviewProof] = useState(null);

    const formatDateRange = (from, to) => {
        if (!from) return "";
        const fromDate = new Date(from);
        const toDate = to ? new Date(to) : fromDate;

        if (fromDate.toDateString() === toDate.toDateString()) {
            return format(fromDate, "LLL dd, yyyy");
        }

        return `${format(fromDate, "LLL dd, yyyy")} - ${format(
            toDate,
            "LLL dd, yyyy"
        )}`;
    };

    const handleOpen = (training = null) => {
        if (training) {
            setData({
                training_id: training.id,
                event_name: training.event_name,
                from_date: training.from_date,
                to_date: training.to_date,
            });
        } else {
            setData({
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
            });
        }
        setOpen(!open);
        clearErrors();
        setPreviewProof(null);
    };

    const handleSubmit = () => {
        clearErrors();
        post("/cooperative-training-service/submit", {
            onSuccess: () => {
                handleOpen();
                toast.success("Inquiry submitted successfully.");
            },
        });
    };

    return (
        <>
            <Head title="Cooperative Training Service" />

            <div className="max-w-7xl mx-auto flex p-4 gap-4">
                <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                        <img src={Img1} className="object-contain" />
                    </div>
                    <div className="flex-1">
                        <img src={Img2} className="object-contain" />
                    </div>
                </div>
                <div className="flex-1 space-y-4">
                    <h1 className="font-semibold">Training Schedule:</h1>
                    <Accordion type="single" collapsible className="w-full">
                        {trainings.length === 0 ? (
                            <p className="text-gray-500 italic">
                                No training schedule available.
                            </p>
                        ) : (
                            trainings.map((training, index) => (
                                <AccordionItem key={index} value={index + 1}>
                                    <AccordionTrigger>
                                        <h1>
                                            <span className="text-primary">
                                                {formatDateRange(
                                                    training.from_date,
                                                    training.to_date
                                                )}
                                            </span>
                                            :{" "}
                                            <span className="font-semibold">
                                                {training.event_name}
                                            </span>
                                        </h1>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-col gap-8">
                                            <FroalaEditorView
                                                model={training.description}
                                            />
                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={() =>
                                                        handleOpen(training)
                                                    }
                                                >
                                                    Inquire Now
                                                </Button>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        )}
                    </Accordion>
                </div>
            </div>

            <Dialog open={open} onOpenChange={() => handleOpen()}>
                <DialogContent className="sm:max-w-[425px] max-h-full overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            <h1 className="text-sm">
                                <span className="text-primary">
                                    {formatDateRange(
                                        data.from_date,
                                        data.to_date
                                    )}
                                </span>
                                :{" "}
                                <span className="font-semibold">
                                    {data.event_name}
                                </span>
                            </h1>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="space-y-1">
                            <Label>Last Name</Label>
                            <Input
                                value={data.last_name}
                                onChange={(e) =>
                                    setData("last_name", e.target.value)
                                }
                            />
                            <InputError message={errors.last_name} />
                        </div>
                        <div className="space-y-1">
                            <Label>First Name</Label>
                            <Input
                                value={data.first_name}
                                onChange={(e) =>
                                    setData("first_name", e.target.value)
                                }
                            />
                            <InputError message={errors.first_name} />
                        </div>
                        <div className="space-y-1">
                            <Label>Middle Name (Optional)</Label>
                            <Input
                                value={data.middle_name}
                                onChange={(e) =>
                                    setData("middle_name", e.target.value)
                                }
                            />
                            <InputError message={errors.middle_name} />
                        </div>
                        <div className="space-y-1">
                            <Label>Email Address (Optional)</Label>
                            <Input
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className="space-y-1">
                            <Label>Birth Date</Label>
                            <Input
                                type="date"
                                value={data.birth_date}
                                onChange={(e) =>
                                    setData("birth_date", e.target.value)
                                }
                            />
                            <InputError message={errors.birth_date} />
                        </div>
                        <div className="space-y-1">
                            <Label>Gender</Label>
                            <Select
                                value={data.gender}
                                onValueChange={(val) => setData("gender", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="male">
                                            Male
                                        </SelectItem>
                                        <SelectItem value="female">
                                            Female
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.gender} />
                        </div>
                        <div className="space-y-1">
                            <Label>Cooperative Name</Label>
                            <Input
                                value={data.cooperative_name}
                                onChange={(e) =>
                                    setData("cooperative_name", e.target.value)
                                }
                            />
                            <InputError message={errors.cooperative_name} />
                        </div>
                        <div className="space-y-1">
                            <Label>Proof of Payment</Label>
                            <div className="flex items-center space-x-4 rounded-md border p-4">
                                <div className="flex-1">
                                    {data.proof_payment ? (
                                        <p className="text-sm font-medium line-clamp-1">
                                            {data.proof_payment.name ||
                                                data.proof_payment
                                                    .split("/")
                                                    .pop()}
                                        </p>
                                    ) : (
                                        <p className="text-sm font-medium">
                                            No file chosen
                                        </p>
                                    )}
                                </div>
                                <Button
                                    onClick={() =>
                                        document
                                            .getElementById("proof_payment")
                                            .click()
                                    }
                                    size="icon"
                                    variant="ghost"
                                    className="shrink-0"
                                >
                                    <Upload />
                                </Button>
                            </div>
                            <input
                                accept=".jpg,.jpeg,.png"
                                id="proof_payment"
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setData("proof_payment", file);
                                    if (file) {
                                        const imageUrl =
                                            URL.createObjectURL(file);
                                        setPreviewProof(imageUrl);
                                    } else {
                                        setPreviewProof(null);
                                    }
                                }}
                                hidden
                            />
                            <InputError message={errors.proof_payment} />
                        </div>
                        {previewProof && (
                            <div className="mx-auto h-[300px]">
                                <img
                                    src={previewProof}
                                    className="object-contain h-full w-full"
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={handleSubmit} disabled={processing}>
                            {processing && <Loader className="animate-spin" />}
                            {processing ? "Submitting" : "Submit"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

CooperativeTraining.layout = (page) => <WebLayout children={page} />;
