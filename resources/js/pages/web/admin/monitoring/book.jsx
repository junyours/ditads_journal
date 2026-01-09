import AppLayout from "@/layouts/app-layout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilePenLine, Loader, MoreHorizontal, Plus } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import DatePicker from "@/components/date-picker";
import { router, useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { debounce } from "lodash";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export default function Book() {
    const { search, books } = usePage().props;
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
        book_title: "",
        chapter: "",
        chapter_title: "",
        author: "",
        deadline: null,
        chapter_file: null,
        payment_status: "",
        completed_book: "",
        status: "",
        remarks: "",
        isbn_submission: "",
        nlp_submission: "",
        completed_electronic: "",
        doi: "",
    });

    const handleOpen = (book = null) => {
        if (book) {
            setEditData(true);
            const journalData = {
                id: book.id,
                book_title: book.book_title,
                chapter: book.chapter,
                chapter_title: book.chapter_title,
                author: book.author,
                deadline: book.deadline,
                chapter_file: book.chapter_file,
                payment_status: book.payment_status,
                completed_book: book.completed_book,
                status: book.status,
                remarks: book.remarks,
                isbn_submission: book.isbn_submission,
                nlp_submission: book.nlp_submission,
                completed_electronic: book.completed_electronic,
                doi: book.doi,
            };
            setData(journalData);
            setInitialData(journalData);
        } else {
            setEditData(false);
            const newData = {
                id: null,
                book_title: "",
                chapter: "",
                chapter_title: "",
                author: "",
                deadline: null,
                chapter_file: null,
                payment_status: "",
                completed_book: "",
                status: "",
                remarks: "",
                isbn_submission: "",
                nlp_submission: "",
                completed_electronic: "",
                doi: "",
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

    const handleAdd = () => {
        clearErrors();
        post("/admin/web/monitoring/book/add", {
            onSuccess: () => {
                handleOpen();
                toast.success("Book monitoring added successfully.");
            },
        });
    };

    const handleUpdate = () => {
        clearErrors();
        post("/admin/web/monitoring/book/update", {
            onSuccess: () => {
                handleOpen();
                toast.success("Book monitoring updated successfully.");
            },
        });
    };

    const handleSearch = debounce((value) => {
        router.get(
            "/admin/web/monitoring/book",
            { search: value },
            {
                preserveState: true,
                replace: true,
            }
        );
    }, 1000);

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <Input
                        defaultValue={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="max-w-xs"
                        placeholder="Search..."
                        type="search"
                    />
                    <Button onClick={() => handleOpen()}>
                        <Plus />
                        Add
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Book Title</TableHead>
                            <TableHead>Chapter</TableHead>
                            <TableHead>Chapter Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Chapter File</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead>Completed Book</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Remarks</TableHead>
                            <TableHead>ISBN Submission</TableHead>
                            <TableHead>NLP Submission</TableHead>
                            <TableHead>Completed Electronic</TableHead>
                            <TableHead>DOI</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {books.data.map((book, index) => (
                            <TableRow key={index}>
                                <TableCell>{book.book_title}</TableCell>
                                <TableCell>{book.chapter}</TableCell>
                                <TableCell>{book.chapter_title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>
                                    {formatDate(book.deadline)}
                                </TableCell>
                                <TableCell>
                                    <a
                                        target="_blank"
                                        href={`/view-pdf/${book.chapter_file}`}
                                        className="hover:underline hover:text-primary"
                                    >
                                        {book.chapter_file}
                                    </a>
                                </TableCell>
                                <TableCell className="capitalize">
                                    {book.payment_status?.split("_").join(" ")}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {book.completed_book?.split("_").join(" ")}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {book.status?.split("_").join(" ")}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {book.remarks?.split("_").join(" ")}
                                </TableCell>
                                <TableCell>{book.isbn_submission}</TableCell>
                                <TableCell>{book.nlp_submission}</TableCell>
                                <TableCell className="capitalize">
                                    {book.completed_electronic
                                        ?.split("_")
                                        .join(" ")}
                                </TableCell>
                                <TableCell>{book.doi}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                            >
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Actions
                                            </DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() => handleOpen(book)}
                                            >
                                                <FilePenLine />
                                                Edit
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination className="justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                className={cn(
                                    "cursor-default",
                                    books.current_page > 1
                                        ? ""
                                        : "pointer-events-none opacity-50"
                                )}
                                onClick={() =>
                                    books.current_page > 1 &&
                                    router.get(
                                        "/admin/web/monitoring/book",
                                        {
                                            page: books.current_page - 1,
                                            search: search ?? "",
                                        },
                                        { preserveState: true }
                                    )
                                }
                            />
                        </PaginationItem>
                        {Array.from(
                            { length: books.last_page },
                            (_, i) => i + 1
                        ).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    isActive={page === books.current_page}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.get(
                                            "/admin/web/monitoring/book",
                                            { page, search: search ?? "" },
                                            { preserveState: true }
                                        );
                                    }}
                                    className="cursor-default"
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                className={cn(
                                    "cursor-default",
                                    books.current_page < books.last_page
                                        ? ""
                                        : "pointer-events-none opacity-50"
                                )}
                                onClick={() =>
                                    books.current_page < books.last_page &&
                                    router.get(
                                        "/admin/web/monitoring/book",
                                        {
                                            page: books.current_page + 1,
                                            search: search ?? "",
                                        },
                                        { preserveState: true }
                                    )
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

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
                            {editData
                                ? "Edit Book Monitoring"
                                : "Add Book Monitoring"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-2">
                        <div className="space-y-1">
                            <Label>Book Title</Label>
                            <Textarea
                                value={data.book_title}
                                onChange={(e) =>
                                    setData("book_title", e.target.value)
                                }
                            />
                            <InputError message={errors.book_title} />
                        </div>
                        <div className="space-y-1">
                            <Label>Chapter</Label>
                            <Input
                                value={data.chapter}
                                onChange={(e) =>
                                    setData("chapter", e.target.value)
                                }
                            />
                            <InputError message={errors.chapter} />
                        </div>
                        <div className="space-y-1">
                            <Label>Chapter Title</Label>
                            <Input
                                value={data.chapter_title}
                                onChange={(e) =>
                                    setData("chapter_title", e.target.value)
                                }
                            />
                            <InputError message={errors.chapter_title} />
                        </div>
                        <div className="space-y-1">
                            <Label>Author</Label>
                            <Textarea
                                value={data.author}
                                onChange={(e) =>
                                    setData("author", e.target.value)
                                }
                            />
                            <InputError message={errors.author} />
                        </div>
                        <div className="space-y-1">
                            <Label>Deadline</Label>
                            <DatePicker
                                date={data.deadline}
                                setDate={(date) => setData("deadline", date)}
                            />
                            <InputError message={errors.deadline} />
                        </div>
                        <div className="space-y-1">
                            <Label>Chapter File</Label>
                            <Input
                                accept=".pdf"
                                type="file"
                                onChange={(e) =>
                                    setData("chapter_file", e.target.files[0])
                                }
                            />
                            <InputError message={errors.chapter_file} />
                        </div>
                        <div className="space-y-1">
                            <Label>Payment Status</Label>
                            <Select
                                value={data.payment_status}
                                onValueChange={(val) =>
                                    setData("payment_status", val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unpaid">
                                        Unpaid
                                    </SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.payment_status} />
                        </div>
                        <div className="space-y-1">
                            <Label>Completed Book</Label>
                            <Select
                                value={data.completed_book}
                                onValueChange={(val) =>
                                    setData("completed_book", val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.completed_book} />
                        </div>
                        <div className="space-y-1">
                            <Label>Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(val) => setData("status", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="under_reviewed">
                                        Under Reviewed
                                    </SelectItem>
                                    <SelectItem value="reviewed">
                                        Reviewed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                        <div className="space-y-1">
                            <Label>Remarks</Label>
                            <Select
                                value={data.remarks}
                                onValueChange={(val) => setData("remarks", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.remarks} />
                        </div>
                        <div className="space-y-1">
                            <Label>ISBN Submission</Label>
                            <Input
                                value={data.isbn_submission}
                                onChange={(e) =>
                                    setData("isbn_submission", e.target.value)
                                }
                            />
                            <InputError message={errors.isbn_submission} />
                        </div>
                        <div className="space-y-1">
                            <Label>NLP Submission</Label>
                            <Input
                                value={data.nlp_submission}
                                onChange={(e) =>
                                    setData("nlp_submission", e.target.value)
                                }
                            />
                            <InputError message={errors.nlp_submission} />
                        </div>
                        <div className="space-y-1">
                            <Label>Completed Electronic</Label>
                            <Select
                                value={data.completed_electronic}
                                onValueChange={(val) =>
                                    setData("completed_electronic", val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.completed_electronic} />
                        </div>
                        <div className="space-y-1">
                            <Label>DOI</Label>
                            <Input
                                value={data.doi}
                                onChange={(e) => setData("doi", e.target.value)}
                            />
                            <InputError message={errors.doi} />
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
                            onClick={editData ? handleUpdate : handleAdd}
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

Book.layout = (page) => (
    <AppLayout children={page} title="List of Book Monitoring" />
);
