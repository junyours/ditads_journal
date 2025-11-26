import AppLayout from "@/layouts/app-layout";
import {
    FilePenLine,
    Image,
    Loader,
    MoreHorizontal,
    Plus,
    Users,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnHeader } from "@/components/table/column-header";
import { DataTable } from "@/components/table/data-table";
import { useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins/fullscreen.min.js";
import "froala-editor/js/plugins/save.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/url.min.js";
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/emoticons.min.js";
import RangeDatePicker from "@/components/range-date";

export default function CooperativeTraining() {
    const { trainings } = usePage().props;
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        id: null,
        event_name: "",
        description: localStorage.getItem("savedText") || "",
        from_date: null,
        to_date: null,
    });

    const handleOpen = (training = null) => {
        if (training) {
            setEditData(true);
            const trainingData = {
                id: training.id,
                event_name: training.event_name,
                description: training.description,
                from_date: training.from_date,
                to_date: training.to_date,
            };
            setData(trainingData);
            setInitialData(trainingData);
        } else {
            setEditData(false);
            const newData = {
                id: null,
                event_name: "",
                description: localStorage.getItem("savedText") || "",
                from_date: null,
                to_date: null,
            };
            setData(newData);
            setInitialData(newData);
        }
        setOpen(!open);
        clearErrors();
    };

    const hasUnsavedChanges = () => {
        return JSON.stringify(data) !== JSON.stringify(initialData);
    };

    const handleUpload = () => {
        clearErrors();
        post("/admin/web/training/upload", {
            onSuccess: () => {
                handleOpen();
                toast.success("Training uploaded successfully.");
                localStorage.removeItem("savedText");
            },
        });
    };

    const handleUpdate = () => {
        clearErrors();
        post("/admin/web/training/update", {
            onSuccess: () => {
                handleOpen();
                toast.success("Training updated successfully.");
                localStorage.removeItem("savedText");
            },
        });
    };

    const columns = [
        {
            accessorKey: "event_name",
            header: "Event Name",
        },
        {
            accessorKey: "from_date",
            header: ({ column }) => (
                <ColumnHeader column={column} title="From Date" />
            ),
            cell: ({ row }) => {
                const training = row.original;
                return formatDate(training.from_date);
            },
        },
        {
            accessorKey: "to_date",
            header: ({ column }) => (
                <ColumnHeader column={column} title="To Date" />
            ),
            cell: ({ row }) => {
                const training = row.original;
                return formatDate(training.to_date);
            },
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
                                <FilePenLine />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    router.visit(
                                        `/admin/web/cooperative-training-service/${training.event_name}`
                                    )
                                }
                            >
                                <Users />
                                Applicants
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
                data={trainings}
                button={{
                    title: "Upload",
                    icon: Plus,
                    onClick: () => handleOpen(),
                }}
            />

            <Sheet
                open={open}
                onOpenChange={(val) => {
                    if (!processing) {
                        if (!val && hasUnsavedChanges()) {
                            setShowConfirmClose(true);
                        } else {
                            setOpen(val);
                        }
                    }
                }}
            >
                <SheetContent className="flex flex-col">
                    <SheetHeader>
                        <SheetTitle>
                            {editData ? "Edit Training" : "Upload Training"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-2">
                        <div className="space-y-1">
                            <Label>Event Name</Label>
                            <Input
                                value={data.event_name}
                                onChange={(e) =>
                                    setData("event_name", e.target.value)
                                }
                            />
                            <InputError message={errors.event_name} />
                        </div>
                        <div className="space-y-1">
                            <Label>Description</Label>
                            <FroalaEditor
                                model={data.description}
                                onModelChange={(val) =>
                                    setData("description", val)
                                }
                                tag="textarea"
                                config={{
                                    saveInterval: 2000,
                                    events: {
                                        "save.before": function (html) {
                                            localStorage.setItem(
                                                "savedText",
                                                html
                                            );
                                        },
                                    },
                                }}
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className="space-y-1">
                            <Label>Date Range</Label>
                            <RangeDatePicker
                                value={{
                                    from_date: data.from_date,
                                    to_date: data.to_date,
                                }}
                                onChange={(range) => {
                                    setData("from_date", range.from_date);
                                    setData("to_date", range.to_date);
                                }}
                            />
                            <InputError
                                message={errors.from_date || errors.to_date}
                            />
                        </div>
                    </div>
                    <SheetFooter>
                        <Button
                            onClick={() => {
                                if (!processing) {
                                    if (hasUnsavedChanges()) {
                                        setShowConfirmClose(true);
                                    } else {
                                        setOpen(false);
                                    }
                                }
                            }}
                            variant="ghost"
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={editData ? handleUpdate : handleUpload}
                            disabled={processing}
                        >
                            {processing && <Loader className="animate-spin" />}
                            {editData
                                ? processing
                                    ? "Updating"
                                    : "Update"
                                : processing
                                ? "Saving"
                                : "Save"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <AlertDialog open={showConfirmClose}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have unsaved changes. Are you sure you want to
                            cancel?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setShowConfirmClose(false)}
                        >
                            No, keep editing
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setShowConfirmClose(false);
                                setOpen(false);
                            }}
                        >
                            Yes, discard
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

CooperativeTraining.layout = (page) => (
    <AppLayout children={page} title="List of Cooperative Training Service" />
);
