import { DataTable } from "@/components/table/data-table";
import AppLayout from "@/layouts/app-layout";
import { router, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CooperativeApplicant() {
    const { training, review_training, approve_training } = usePage().props;
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(null);
    const [processing, setProcessing] = useState(false);

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
        setData(training);
        setOpen(!open);
    };

    const handleApprove = () => {
        setProcessing(true);
        router.post(
            `/admin/web/cooperative-training-service/${data?.id}`,
            {},
            {
                onSuccess: () => {
                    handleOpen();
                    toast.success("Applicant approved successfully.");
                },
                onFinish: () => {
                    setProcessing(false);
                },
            }
        );
    };

    const columns = [
        {
            accessorKey: "application_number",
            header: "Application Number",
        },
        {
            accessorKey: "applicant.cooperative_name",
            header: "Cooperative Name",
        },
        {
            accessorKey: "applicant.last_name",
            header: "Last Name",
        },
        {
            accessorKey: "applicant.first_name",
            header: "First Name",
        },
        {
            accessorKey: "applicant.middle_name",
            header: "Middle Name",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const training = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => handleOpen(training)}
                            >
                                <View />
                                View
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <>
            <div className="space-y-4">
                <h1>
                    <span className="text-primary">
                        {formatDateRange(training.from_date, training.to_date)}
                    </span>
                    :{" "}
                    <span className="font-semibold">{training.event_name}</span>
                </h1>
                <Tabs defaultValue="review">
                    <TabsList>
                        <TabsTrigger value="review">Under Review</TabsTrigger>
                        <TabsTrigger value="approve">Approved</TabsTrigger>
                    </TabsList>
                    <TabsContent value="review">
                        <DataTable
                            columns={columns}
                            data={review_training}
                            button={null}
                        />
                    </TabsContent>
                    <TabsContent value="approve">
                        <DataTable
                            columns={columns}
                            data={approve_training}
                            button={null}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={open} onOpenChange={() => handleOpen()}>
                <DialogContent className="sm:max-w-[425px] max-h-full overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="space-y-1">
                            <Label>Last Name</Label>
                            <Input value={data?.applicant.last_name} readOnly />
                        </div>
                        <div className="space-y-1">
                            <Label>First Name</Label>
                            <Input
                                value={data?.applicant.first_name}
                                readOnly
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Middle Name</Label>
                            <Input
                                value={data?.applicant.middle_name}
                                readOnly
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Email Address</Label>
                            <Input
                                value={data?.applicant.email_address}
                                readOnly
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Birth Date</Label>
                            <Input
                                type="date"
                                value={data?.applicant.birth_date}
                                readOnly
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Gender</Label>
                            <Input value={data?.applicant.gender} readOnly />
                        </div>
                        <div className="space-y-1">
                            <Label>Cooperative Name</Label>
                            <Input
                                value={data?.applicant.cooperative_name}
                                readOnly
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Proof of Payment</Label>
                            <div className="mx-auto h-[300px]">
                                <img
                                    src={`https://lh3.googleusercontent.com/d/${data?.proof_payment}`}
                                    className="object-contain h-full w-full"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleApprove} disabled={processing}>
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

CooperativeApplicant.layout = (page) => (
    <AppLayout
        children={page}
        title="List of Cooperative Training Applicants"
    />
);
