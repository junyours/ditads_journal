import AppLayout from "@/layouts/app-layout";
import { FilePenLine, Image, Loader, MoreHorizontal, Plus } from "lucide-react";
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
import { useForm, usePage } from "@inertiajs/react";
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
import DatePicker from "@/components/date-picker";
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

export default function Event() {
    const { events } = usePage().props;
    const [open, setOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
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
        title: "",
        contents: localStorage.getItem("savedText") || "",
        image: null,
        date: null,
    });

    const handleOpen = (event = null) => {
        if (event) {
            setEditData(true);
            const eventData = {
                id: event.id,
                title: event.title,
                contents: event.content,
                date: event.date,
            };
            setData(eventData);
            setInitialData(eventData);
            setPreviewImage(event.image);
        } else {
            setEditData(false);
            const newData = {
                id: null,
                title: "",
                contents: localStorage.getItem("savedText") || "",
                image: null,
                date: null,
            };
            setData(newData);
            setInitialData(newData);
            setPreviewImage(null);
        }
        setOpen(!open);
        clearErrors();
    };

    const hasUnsavedChanges = () => {
        return JSON.stringify(data) !== JSON.stringify(initialData);
    };

    const handleUpload = () => {
        clearErrors();
        post("/admin/web/events/upload", {
            onSuccess: () => {
                handleOpen();
                toast.success("Event uploaded successfully.");
                localStorage.removeItem("savedText");
            },
        });
    };

    const handleUpdate = () => {
        clearErrors();
        post("/admin/web/events/update", {
            onSuccess: () => {
                handleOpen();
                toast.success("Event updated successfully.");
                localStorage.removeItem("savedText");
            },
        });
    };

    const columns = [
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "date",
            header: ({ column }) => (
                <ColumnHeader column={column} title="Date" />
            ),
            cell: ({ row }) => {
                const event = row.original;
                return formatDate(event.date);
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const event = row.original;
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
                            <DropdownMenuItem onClick={() => handleOpen(event)}>
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
                data={events}
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
                            {editData ? "Edit Magazine" : "Upload Magazine"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-2">
                        <div className="space-y-1">
                            <Label>Image</Label>
                            <div className="flex items-center gap-4">
                                <div className="size-20">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="profile-picture"
                                            className="object-cover size-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center size-full bg-muted">
                                            <Image size={40} />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={() =>
                                        document.getElementById("image").click()
                                    }
                                    size="sm"
                                    variant="outline"
                                >
                                    {previewImage ? "Change" : "Upload"}
                                </Button>
                                <input
                                    accept=".jpg,.jpeg,.png"
                                    id="image"
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setData("image", file);
                                        if (file) {
                                            const imageUrl =
                                                URL.createObjectURL(file);
                                            setPreviewImage(imageUrl);
                                        } else {
                                            setPreviewImage(null);
                                        }
                                    }}
                                    hidden
                                />
                            </div>
                            <InputError message={errors.image} />
                        </div>
                        <div className="space-y-1">
                            <Label>Title</Label>
                            <Input
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                            />
                            <InputError message={errors.title} />
                        </div>
                        <div className="space-y-1">
                            <Label>Content</Label>
                            <FroalaEditor
                                model={data.contents}
                                onModelChange={(val) =>
                                    setData("contents", val)
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
                            <InputError message={errors.contents} />
                        </div>
                        <div className="space-y-1">
                            <Label>Date</Label>
                            <DatePicker
                                date={data.date}
                                setDate={(date) => setData("date", date)}
                            />
                            <InputError message={errors.date} />
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

Event.layout = (page) => <AppLayout children={page} title="List of Events" />;
