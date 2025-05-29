import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    FilePenLine,
    MoreHorizontal,
    Plus,
    QrCode,
    Upload,
} from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function PaymentMethod() {
    const { payments } = usePage().props;
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            account_name: "",
            account_number: "",
            account_email: "",
            qr_code: null,
            have_qr: "no",
        });
    const [editData, setEditData] = useState(false);
    const [previewQr, setPreviewQr] = useState(null);

    const handleOpen = (payment = null) => {
        if (payment) {
            setEditData(true);
            const paymentData = {
                id: payment.id,
                name: payment.name,
                account_name: payment.account_name,
                account_number: payment.account_number,
                account_email: payment.account_email,
                qr_code: payment.qr_code,
                have_qr: payment.qr_code ? "yes" : "no",
            };
            setData(paymentData);
            if (payment.qr_code) {
                setPreviewQr(payment.qr_code);
            } else {
                setPreviewQr(null);
            }
        } else {
            setEditData(false);
            const newData = {
                name: "",
                account_name: "",
                account_number: "",
                account_email: "",
                qr_code: null,
                have_qr: "no",
            };
            setData(newData);
            setPreviewQr(null);
        }
        setOpen(!open);
        clearErrors();
    };

    const handleAdd = () => {
        clearErrors();
        post("/admin/others/payment-methods/add", {
            onSuccess: () => {
                handleOpen();
                toast.success("Payment method added successfully.");
            },
        });
    };

    const handleUpdate = () => {
        clearErrors();
        post("/admin/others/payment-methods/update", {
            onSuccess: () => {
                handleOpen();
                toast.success("Payment method updated successfully.");
            },
        });
    };

    const columns = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "account_name",
            header: "Account Name",
        },
        {
            accessorKey: "account_number",
            header: "Account Number",
        },
        {
            accessorKey: "account_email",
            header: "Account Email",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const payment = row.original;
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
                                onClick={() => handleOpen(payment)}
                            >
                                <FilePenLine />
                                Edit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={payments}
                button={{
                    title: "Add",
                    icon: Plus,
                    onClick: () => handleOpen(),
                }}
            />

            <Sheet
                open={open}
                onOpenChange={() => {
                    if (!processing) {
                        handleOpen();
                    }
                }}
            >
                <SheetContent className="flex flex-col">
                    <SheetHeader>
                        <SheetTitle>
                            {editData
                                ? "Edit Payment Method"
                                : "Add Payment Method"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-2">
                        <div className="space-y-1">
                            <Label>Name</Label>
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-1">
                            <Label>Account Name</Label>
                            <Input
                                value={data.account_name}
                                onChange={(e) =>
                                    setData("account_name", e.target.value)
                                }
                            />
                            <InputError message={errors.account_name} />
                        </div>
                        <div className="space-y-1">
                            <Label>Account Number</Label>
                            <Input
                                value={data.account_number}
                                onChange={(e) =>
                                    setData("account_number", e.target.value)
                                }
                            />
                            <InputError message={errors.account_number} />
                        </div>
                        <div className="space-y-1">
                            <Label>Account Email</Label>
                            <Input
                                value={data.account_email}
                                onChange={(e) =>
                                    setData("account_email", e.target.value)
                                }
                            />
                            <InputError message={errors.account_email} />
                        </div>
                        <div className="space-y-1">
                            <Label>Have a QR Code?</Label>
                            <Select
                                value={data.have_qr}
                                onValueChange={(val) => setData("have_qr", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {data.have_qr === "yes" && (
                            <>
                                <div className="space-y-1">
                                    <div className=" flex items-center space-x-4 rounded-md border p-4">
                                        <QrCode className="shrink-0" />
                                        <div className="flex-1">
                                            {data.qr_code ? (
                                                <p className="text-sm font-medium line-clamp-2 break-words">
                                                    {data.qr_code.name ||
                                                        data.qr_code
                                                            .split("/")
                                                            .pop()}
                                                </p>
                                            ) : (
                                                <p className="text-sm font-medium leading-none">
                                                    No file chosen
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            onClick={() =>
                                                document
                                                    .getElementById("qr_code")
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
                                        id="qr_code"
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setData("qr_code", file);
                                            if (file) {
                                                const imageUrl =
                                                    URL.createObjectURL(file);
                                                setPreviewQr(imageUrl);
                                            } else {
                                                setPreviewQr(null);
                                            }
                                        }}
                                        hidden
                                    />
                                    <InputError message={errors.qr_code} />
                                </div>
                                {previewQr && (
                                    <div className="max-w-[250px] mx-auto h-[300px]">
                                        <img
                                            src={previewQr}
                                            className="object-contain h-full w-full"
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <SheetFooter>
                        <Button
                            onClick={() => handleOpen()}
                            variant="ghost"
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={editData ? handleUpdate : handleAdd}
                            disabled={processing}
                        >
                            {editData ? "Update" : "Save"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}

PaymentMethod.layout = (page) => (
    <AppLayout children={page} title="Payment Methods" />
);
