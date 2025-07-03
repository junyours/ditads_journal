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
    BookUser,
    Check,
    FilePenLine,
    FileText,
    Loader,
    MoreHorizontal,
    Plus,
    Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { ColumnHeader } from "@/components/table/column-header";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { router, useForm, usePage } from "@inertiajs/react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Avatar from "../../../../../public/images/user.png";

export default function BookPublication() {
    const { books, categories, authors } = usePage().props;
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [previewCoverPage, setPreviewCoverPage] = useState(null);
    const [editData, setEditData] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const [selectedAuthorsByBook, setSelectedAuthorsByBook] = useState({});
    const [selectedBook, setSelectedBook] = useState([]);
    const [searchAuthor, setSearchAuthor] = useState("");
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
        overview_pdf_file: null,
        hard_price: "",
        soft_price: "",
    });

    const filteredAuthors = useMemo(() => {
        if (!searchAuthor.trim()) return authors;

        return authors.filter((author) =>
            author.name.toLowerCase().includes(searchAuthor.toLowerCase())
        );
    }, [searchAuthor, authors]);

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
                overview_pdf_file: book.overview_pdf_file,
                hard_price: book.hard_price,
                soft_price: book.soft_price,
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
                overview_pdf_file: null,
                hard_price: "",
                soft_price: "",
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

    const handleOpenAuthorDialog = (book) => {
        setSelectedBook(book.id);
        const linkedAuthors = authors
            .filter((author) =>
                author.author_book?.some(
                    (ab) => ab.book_publication_id === book.id
                )
            )
            .map((author) => author.id);

        setSelectedAuthorsByBook((prev) => ({
            ...prev,
            [book.id]: linkedAuthors,
        }));

        setIsOpen(true);
    };

    const handleToggle = (authorId) => {
        setSelectedAuthorsByBook((prev) => {
            const currentSelected = prev[selectedBook] || [];
            const updatedSelected = currentSelected.includes(authorId)
                ? currentSelected.filter((id) => id !== authorId)
                : [...currentSelected, authorId];

            router.post("/api/admin/web/book-publication/link/author", {
                book_id: selectedBook,
                author_id: updatedSelected,
            });

            return {
                ...prev,
                [selectedBook]: updatedSelected,
            };
        });
    };

    const handleUpload = () => {
        clearErrors();
        post("/admin/web/book-publication/upload", {
            onSuccess: () => {
                handleOpen();
                toast.success("Book uploaded successfully.");
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleUpdate = () => {
        clearErrors();
        post("/admin/web/book-publication/update", {
            onSuccess: () => {
                handleOpen();
                toast.success("Book updated successfully.");
            },
            preserveState: true,
            preserveScroll: true,
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
                            <DropdownMenuItem
                                onClick={() => handleOpenAuthorDialog(book)}
                            >
                                <BookUser />
                                Open access author
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
                        <div className="space-y-1">
                            <Label>Book PDF File</Label>
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
                        </div>
                        {/* <div className="space-y-1">
                            <Label>Overview PDF File</Label>
                            <div className="flex items-center space-x-4 rounded-md border p-4">
                                <img src={Pdf} className="size-8" />
                                <div className="flex-1 space-y-1">
                                    {typeof data.overview_pdf_file ===
                                    "string" ? (
                                        <>
                                            <a
                                                href={`/view-book/${data.overview_pdf_file}`}
                                                target="_blank"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View PDF
                                            </a>
                                        </>
                                    ) : data.overview_pdf_file ? (
                                        <>
                                            <p className="text-sm font-medium line-clamp-1">
                                                {data.overview_pdf_file.name}
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
                                            .getElementById("overview_pdf_file")
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
                                id="overview_pdf_file"
                                type="file"
                                onChange={(e) =>
                                    setData(
                                        "overview_pdf_file",
                                        e.target.files[0]
                                    )
                                }
                                hidden
                            />
                            <InputError message={errors.overview_pdf_file} />
                        </div> */}
                        <div className="space-y-1">
                            <Label>Hard Bound Price</Label>
                            <Input
                                type="number"
                                value={data.hard_price}
                                onChange={(e) =>
                                    setData("hard_price", e.target.value)
                                }
                            />
                            <InputError message={errors.hard_price} />
                        </div>
                        <div className="space-y-1">
                            <Label>Soft Bound Price</Label>
                            <Input
                                type="number"
                                value={data.soft_price}
                                onChange={(e) =>
                                    setData("soft_price", e.target.value)
                                }
                            />
                            <InputError message={errors.soft_price} />
                        </div>
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

            <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Book open access</DialogTitle>
                        <DialogDescription>
                            Add author/s for open access book.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder="Search for name"
                        value={searchAuthor}
                        onChange={(e) => setSearchAuthor(e.target.value)}
                    />
                    <div className="flex flex-col gap-1 max-h-64 overflow-auto">
                        {filteredAuthors.map((author) => {
                            const selectedAuthors =
                                selectedAuthorsByBook[selectedBook] || [];
                            const isChecked = selectedAuthors.includes(
                                author.id
                            );

                            return (
                                <div
                                    key={author.id}
                                    onClick={() => handleToggle(author.id)}
                                    className={`flex items-center justify-between p-1 rounded-lg cursor-pointer ${
                                        isChecked
                                            ? "bg-muted"
                                            : "hover:bg-muted"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="size-8">
                                            <img
                                                src={author.avatar ?? Avatar}
                                                alt="user"
                                                className="rounded-full size-full object-cover"
                                            />
                                        </div>
                                        <h1 className="text-sm">
                                            {author.name}
                                        </h1>
                                    </div>
                                    {isChecked && (
                                        <Check
                                            size={16}
                                            color="green"
                                            className="shrink-0 mr-2"
                                        />
                                    )}
                                </div>
                            );
                        })}
                        {filteredAuthors.length === 0 && (
                            <p className="text-center">No authors found.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

BookPublication.layout = (page) => (
    <AppLayout children={page} title="List of Book Publications" />
);
