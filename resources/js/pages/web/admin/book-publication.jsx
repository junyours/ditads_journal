import AppLayout from "@/layouts/app-layout";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookText, FilePenLine, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { ColumnHeader } from "@/components/table/column-header";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useForm, usePage } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function BookPublication() {
    const { books } = usePage().props;
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
            title: "",
            isbn: "",
            cover_page: null,
            author: "",
            overview: "",
        });

    const handleOpen = (book = null) => {
        if (book) {
            setEditData(true);
            setData({
                id: book.id,
                title: book.title,
                isbn: book.isbn,
                author: book.author,
                overview: book.overview,
            });
            setPreviewCoverPage(book.cover_page);
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
        post("/admin/web/book-publication/upload", {
            onSuccess: () => {
                handleOpen();
                toast.success("Book uploaded successfully.");
            },
        });
    };

    const handleUpdate = () => {
        clearErrors();
        post("/admin/web/book-publication/update", {
            onSuccess: () => {
                handleOpen();
                toast.success("Book updated successfully.");
            },
        });
    };

    const columns = [
        {
            accessorKey: "cover_page",
            header: "",
            cell: ({ row }) => {
                const book = row.original;
                return (
                    <div className="size-8">
                        <img
                            src={book.cover_page}
                            alt="cover_page"
                            className="size-full object-cover"
                        />
                    </div>
                );
            },
        },
        {
            accessorKey: "isbn",
            header: ({ column }) => (
                <ColumnHeader column={column} title="ISBN" />
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "created_at",
            header: "Published at",
            cell: ({ row }) => {
                const book = row.original;
                return formatDate(book.created_at);
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const book = row.original;
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
                            <DropdownMenuItem onClick={() => handleOpen(book)}>
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
                data={books}
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
                            {editData ? "Edit Book" : "Upload Book"}
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
                                            <BookText size={40} />
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
                            <Label>ISBN</Label>
                            <Input
                                value={data.isbn}
                                onChange={(e) =>
                                    setData("isbn", e.target.value)
                                }
                            />
                            <InputError message={errors.isbn} />
                        </div>
                        <div className="space-y-1">
                            <Label>Author/s</Label>
                            <Textarea
                                value={data.author}
                                onChange={(e) =>
                                    setData("author", e.target.value)
                                }
                            />
                            <InputError message={errors.author} />
                        </div>
                        <div className="space-y-1">
                            <Label>Overview</Label>
                            <Textarea
                                value={data.overview}
                                onChange={(e) =>
                                    setData("overview", e.target.value)
                                }
                            />
                            <InputError message={errors.overview} />
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

BookPublication.layout = (page) => (
    <AppLayout children={page} title="List of Book Publications" />
);
