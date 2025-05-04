import AppLayout from "@/layouts/app-layout";
import { BookOpenText, FilePenLine, MoreHorizontal, Plus } from "lucide-react";
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

export default function Magazine() {
    const { magazines } = usePage().props;
    const [open, setOpen] = useState(false);
    const [previewCoverPage, setPreviewCoverPage] = useState(null);
    const [editData, setEditData] = useState(false);
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            id: null,
            volume: "",
            issue: "",
            cover_page: null,
        });

    const handleOpen = (magazine = null) => {
        if (magazine) {
            setEditData(true);
            setData({
                id: magazine.id,
                volume: magazine.volume,
                issue: magazine.issue,
            });
            setPreviewCoverPage(magazine.cover_page);
        } else {
            setEditData(false);
            reset();
            setPreviewCoverPage(null);
        }
        setOpen(!open);
        clearErrors();
    };

    const handleUpload = () => {
        clearErrors();
        post("/admin/web/magazine/upload", {
            onSuccess: () => {
                handleOpen();
                toast.success("Magazine uploaded successfully.");
            },
        });
    };

    const handleUpdate = () => {
        clearErrors();
        post("/admin/web/magazine/update", {
            onSuccess: () => {
                handleOpen();
                toast.success("Magazine updated successfully.");
            },
        });
    };

    const columns = [
        {
            accessorKey: "cover_page",
            header: "",
            cell: ({ row }) => {
                const magazine = row.original;
                return (
                    <div className="size-8">
                        <img
                            src={magazine.cover_page}
                            alt="cover_page"
                            className="size-full object-cover"
                        />
                    </div>
                );
            },
        },
        {
            accessorKey: "volume",
            header: ({ column }) => (
                <ColumnHeader column={column} title="Volume" />
            ),
        },
        {
            accessorKey: "issue",
            header: ({ column }) => (
                <ColumnHeader column={column} title="Issue" />
            ),
        },
        {
            accessorKey: "created_at",
            header: "Published at",
            cell: ({ row }) => {
                const magazine = row.original;
                return formatDate(magazine.created_at);
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const magazine = row.original;
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
                                onClick={() => handleOpen(magazine)}
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
                data={magazines}
                button={{
                    title: "Upload",
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
                            {editData ? "Edit Magazine" : "Upload Magazine"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-2">
                        <div className="space-y-1">
                            <Label>Cover Page</Label>
                            <div className="flex items-center gap-4">
                                <div className="size-20">
                                    {previewCoverPage ? (
                                        <img
                                            src={previewCoverPage}
                                            alt="profile-picture"
                                            className="object-cover size-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center size-full bg-muted">
                                            <BookOpenText size={40} />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={() =>
                                        document
                                            .getElementById("cover_page")
                                            .click()
                                    }
                                    size="sm"
                                    variant="outline"
                                >
                                    {previewCoverPage ? "Change" : "Upload"}
                                </Button>
                                <input
                                    accept=".jpg,.jpeg,.png"
                                    id="cover_page"
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setData("cover_page", file);
                                        if (file) {
                                            const imageUrl =
                                                URL.createObjectURL(file);
                                            setPreviewCoverPage(imageUrl);
                                        } else {
                                            setPreviewCoverPage(null);
                                        }
                                    }}
                                    hidden
                                />
                            </div>
                            <InputError message={errors.cover_page} />
                        </div>
                        <div className="space-y-1">
                            <Label>Volume</Label>
                            <Input
                                value={data.volume}
                                onChange={(e) =>
                                    setData("volume", e.target.value)
                                }
                            />
                            <InputError message={errors.volume} />
                        </div>
                        <div className="space-y-1">
                            <Label>Issue</Label>
                            <Input
                                value={data.issue}
                                onChange={(e) =>
                                    setData("issue", e.target.value)
                                }
                            />
                            <InputError message={errors.issue} />
                        </div>
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
                            onClick={editData ? handleUpdate : handleUpload}
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

Magazine.layout = (page) => (
    <AppLayout children={page} title="List of Magazines" />
);
