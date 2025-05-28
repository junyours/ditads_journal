import AppLayout from "@/layouts/app-layout";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    BookText,
    FilePenLine,
    FileText,
    Loader,
    MoreHorizontal,
    Plus,
    Upload,
} from "lucide-react";
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
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DatePicker from "@/components/date-picker";
import Pdf from "../../../../../public/images/pdf.png";
import BookCategoryCombobox from "@/components/bookcategory-combobox";

export default function BookPublication() {
    const { books, categories } = usePage().props;
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
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        id: null,
        title: "",
        soft_isbn: "",
        hard_isbn: "",
        published_at: null,
        cover_page: null,
        author: "",
        overview: "",
        pdf_file: null,
        book_category_id: null,
        doi: "",
    });

    const handleOpen = (book = null) => {
        if (book) {
            setEditData(true);
            const bookData = {
                id: book.id,
                title: book.title,
                soft_isbn: book.soft_isbn,
                hard_isbn: book.hard_isbn,
                published_at: book.published_at,
                author: book.author,
                overview: book.overview,
                pdf_file: book.pdf_file,
                book_category_id: book.book_category_id,
                doi: book.doi,
            };
            setData(bookData);
            setInitialData(bookData);
            setPreviewCoverPage(book.cover_page);
        } else {
            setEditData(false);
            const newData = {
                id: null,
                title: "",
                soft_isbn: "",
                hard_isbn: "",
                published_at: null,
                cover_page: null,
                author: "",
                overview: "",
                pdf_file: null,
                book_category_id: null,
                doi: "",
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
            accessorKey: "soft_isbn",
            header: ({ column }) => (
                <ColumnHeader column={column} title="Soft Bound ISBN" />
            ),
        },
        {
            accessorKey: "hard_isbn",
            header: ({ column }) => (
                <ColumnHeader column={column} title="Hard Bound ISBN" />
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "published_at",
            header: "Published At",
            cell: ({ row }) => {
                const book = row.original;
                return formatDate(book.published_at);
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
                            <DropdownMenuItem asChild>
                                <a
                                    href={`/view-book/${book.pdf_file}`}
                                    target="_blank"
                                >
                                    <FileText />
                                    View PDF
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
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
                            {editData ? "Edit Book" : "Upload Book"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-2">
                        {/* <div className="space-y-1">
                            <Label>Book Category</Label>
                            <BookCategoryCombobox
                                options={categories}
                                value={data.book_category_id}
                                setValue={(val) =>
                                    setData("book_category_id", val)
                                }
                            />
                            <InputError message={errors.book_category_id} />
                        </div> */}
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
                        {/* <div className="space-y-1">
                            <Label>PDF File</Label>
                            <div className="flex items-center space-x-4 rounded-md border p-4">
                                <img src={Pdf} className="size-8" />
                                <div className="flex-1 space-y-1">
                                    {typeof data.pdf_file === "string" ? (
                                        <>
                                            <a
                                                href={`/view-book/${data.pdf_file}`}
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
                        </div> */}
                        <div className="space-y-1">
                            <Label>Title</Label>
                            <Textarea
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                            />
                            <InputError message={errors.title} />
                        </div>
                        <div className="space-y-1">
                            <Label>Soft Bound ISBN</Label>
                            <Input
                                value={data.soft_isbn}
                                onChange={(e) =>
                                    setData("soft_isbn", e.target.value)
                                }
                            />
                            <InputError message={errors.soft_isbn} />
                        </div>
                        <div className="space-y-1">
                            <Label>Hard Bound ISBN</Label>
                            <Input
                                value={data.hard_isbn}
                                onChange={(e) =>
                                    setData("hard_isbn", e.target.value)
                                }
                            />
                            <InputError message={errors.hard_isbn} />
                        </div>
                        <div className="space-y-1">
                            <Label>DOI</Label>
                            <Input
                                value={data.doi}
                                onChange={(e) => setData("doi", e.target.value)}
                            />
                            <InputError message={errors.doi} />
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

BookPublication.layout = (page) => (
    <AppLayout children={page} title="List of Book Publications" />
);
