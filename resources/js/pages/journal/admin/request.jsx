import { Badge } from "@/components/ui/badge";
import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, MoreHorizontal, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import Combobox from "@/components/combobox";
import { toast } from "sonner";
import InputError from "@/components/input-error";

export default function Request() {
    const { journals, editors } = usePage().props;
    const formatDateTime = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        id: null,
        request_id: null,
        editor_id: null,
    });

    const handleOpen = (request_id = null) => {
        if (request_id) {
            setData("request_id", request_id);
        } else {
            setData("request_id", null);
        }
        setOpen(!open);
    };

    const handleSave = () => {
        clearErrors();
        post("/admin/journal/requests/accept", {
            onSuccess: () => {
                handleOpen();
                toast.success("Request accepted successfully.");
            },
        });
    };

    const columns = [
        {
            accessorKey: "request_number",
            header: "Request Number",
        },
        {
            accessorKey: "user.name",
            header: "Author Name",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const request = row.original;
                return (
                    <Badge
                        variant={
                            request.status === "pending"
                                ? "secondary"
                                : "default"
                        }
                        className="capitalize"
                    >
                        {request.status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: "Requested at",
            cell: ({ row }) => {
                const request = row.original;
                return formatDateTime(request.created_at);
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const request = row.original;
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
                                onClick={() => handleOpen(request.id)}
                            >
                                <Check />
                                Accept
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <>
            <DataTable columns={columns} data={journals} button={null} />

            <Dialog open={open} onOpenChange={() => handleOpen()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Select who you want to assign to edit the journal.
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6">
                        <Card
                            onClick={() => setSelected(1)}
                            className={`shadow-none cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                                selected === 1 ? "ring-2 ring-primary" : ""
                            }`}
                        >
                            <div className="flex flex-col items-center space-y-2 p-4">
                                <Users />
                                <CardTitle>Assign Editors</CardTitle>
                            </div>
                        </Card>
                        <Card
                            onClick={() => {
                                setSelected(2);
                                setData("editor_id", null);
                            }}
                            className={`shadow-none cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                                selected === 2 ? "ring-2 ring-primary" : ""
                            }`}
                        >
                            <div className="flex flex-col items-center space-y-2 p-4">
                                <User />
                                <CardTitle>Assign Me</CardTitle>
                            </div>
                        </Card>
                    </div>
                    {selected === 1 && (
                        <div className="space-y-1">
                            <Combobox
                                options={editors}
                                value={data.editor_id}
                                setValue={(val) => setData("editor_id", val)}
                            />
                            <InputError message={errors.editor_id} />
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Request.layout = (page) => <AppLayout children={page} title="Requests" />;
