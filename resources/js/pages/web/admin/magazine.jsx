import AppLayout from "@/layouts/app-layout";
import {
    BookOpenText,
    FilePenLine,
    Loader,
    MoreHorizontal,
    Plus,
    Upload,
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
import Pdf from "../../../../../public/images/pdf.png";
import DatePicker from "@/components/date-picker";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const baseYear = 2025;
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const calculatedVolume = currentYear - baseYear + 1;

let calculatedIssue = 1;
if (currentMonth >= 4 && currentMonth <= 6) {
    calculatedIssue = 2;
} else if (currentMonth >= 7 && currentMonth <= 9) {
    calculatedIssue = 3;
} else if (currentMonth >= 10 && currentMonth <= 12) {
    calculatedIssue = 4;
}

export default function Magazine() {
    const { magazines } = usePage().props;
    const [open, setOpen] = useState(false);
    const [previewCoverPage, setPreviewCoverPage] = useState(null);
    const [editData, setEditData] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            id: null,
            volume: calculatedVolume,
            issue: calculatedIssue,
            cover_page: null,
            pdf_file: null,
            published_at: null,
        });

    const handleOpen = (magazine = null) => {
        if (magazine) {
            setEditData(true);
            const magazineData = {
                id: magazine.id,
                volume: magazine.volume,
                issue: magazine.issue,
                pdf_file: magazine.pdf_file,
                published_at: magazine.published_at,
            };
            setData(magazineData);
            setInitialData(magazineData);
            setPreviewCoverPage(magazine.cover_page);
        } else {
            setEditData(false);
            const newData = {
                id: null,
                volume: calculatedVolume,
                issue: calculatedIssue,
                cover_page: null,
                pdf_file: null,
                published_at: null,
            };
            setData(newData);
            setInitialData(newData);
            setPreviewCoverPage(null);
        }
        setOpen(!open);
        clearErrors();
    };

    const hasUnsavedChanges = () => {
        return JSON.stringify(data) !== JSON.stringify(initialData);
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
            accessorKey: "published_at",
            header: "Published at",
            cell: ({ row }) => {
                const magazine = row.original;
                return formatDate(magazine.published_at);
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
                            <div className="flex items-center space-x-4 rounded-md border p-4">
                                <img src={Pdf} className="size-8" />
                                <div className="flex-1 space-y-1">
                                    {typeof data.pdf_file === "string" ? (
                                        <>
                                            <a
                                                href={`/view-magazine/${data.pdf_file}`}
                                                target="_blank"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View PDF
                                            </a>
                                        </>
                                    ) : data.pdf_file ? (
                                        <>
                                            <p className="text-sm font-medium line-clamp-1">
                                                {data.pdf_file.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PDF
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-sm font-medium">
                                            No file chosen
                                        </p>
                                    )}
                                </div>
                                <Button
                                    onClick={() =>
                                        document
                                            .getElementById("pdf_file")
                                            .click()
                                    }
                                    size="icon"
                                    variant="ghost"
                                >
                                    <Upload />
                                </Button>
                            </div>
                            <input
                                accept=".pdf"
                                id="pdf_file"
                                type="file"
                                onChange={(e) =>
                                    setData("pdf_file", e.target.files[0])
                                }
                                hidden
                            />
                            <InputError message={errors.pdf_file} />
                        </div>
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
                                type="number"
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
                                type="number"
                                value={data.issue}
                                onChange={(e) =>
                                    setData("issue", e.target.value)
                                }
                            />
                            <InputError message={errors.issue} />
                        </div>
                        <div className="space-y-1">
                            <Label>Published At</Label>
                            <DatePicker
                                date={data.published_at}
                                setDate={(date) =>
                                    setData("published_at", date)
                                }
                            />
                            <InputError message={errors.published_at} />
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

Magazine.layout = (page) => (
    <AppLayout children={page} title="List of Magazines" />
);
