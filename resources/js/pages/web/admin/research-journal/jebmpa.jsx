import AppLayout from "@/layouts/app-layout";
import {
    FilePenLine,
    Loader,
    MoreHorizontal,
    Plus,
    Trash,
    Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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
import Pdf from "../../../../../../public/images/pdf.png";
import { toast } from "sonner";
import DatePicker from "@/components/date-picker";
import countries from "../../../../../../public/files/countries.json";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CountryCombobox from "@/components/country-combobox";
import { debounce } from "lodash";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const baseYear = 2025;
const now = new Date();
let currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

let calculatedVolume;
let calculatedIssue;

if (currentMonth >= 4 && currentMonth <= 6) {
    calculatedIssue = 1;
    calculatedVolume = currentYear - baseYear + 1;
} else if (currentMonth >= 7 && currentMonth <= 9) {
    calculatedIssue = 2;
    calculatedVolume = currentYear - baseYear + 1;
} else if (currentMonth >= 10 && currentMonth <= 12) {
    calculatedIssue = 3;
    calculatedVolume = currentYear - baseYear + 1;
} else {
    calculatedIssue = 4;
    calculatedVolume = currentYear - 1 - baseYear + 1;
}

export default function JEBMPA() {
    const { search, journals, flash } = usePage().props;
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
        volume: calculatedVolume,
        issue: calculatedIssue,
        title: "",
        author: "",
        abstract: "",
        pdf_file: null,
        published_at: null,
        country: "",
        page_number: "",
        tracking_number: "",
        doi: "",
        type: "jebmpa",
    });
    const [showDelete, setShowDelete] = useState({
        id: null,
        title: "",
        show: false,
    });
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleOpen = (journal = null) => {
        if (journal) {
            setEditData(true);
            const journalData = {
                id: journal.id,
                volume: journal.volume,
                issue: journal.issue,
                title: journal.title,
                author: journal.author,
                abstract: journal.abstract,
                pdf_file: journal.pdf_file,
                published_at: journal.published_at,
                country: journal.country,
                page_number: journal.page_number,
                tracking_number: journal.tracking_number,
                doi: journal.doi,
                type: journal.type,
            };
            setData(journalData);
            setInitialData(journalData);
        } else {
            setEditData(false);
            const newData = {
                id: null,
                volume: calculatedVolume,
                issue: calculatedIssue,
                title: "",
                author: "",
                abstract: "",
                pdf_file: null,
                published_at: null,
                country: "",
                page_number: "",
                tracking_number: "",
                doi: "",
                type: "jebmpa",
            };
            setData(newData);
            setInitialData(newData);
        }
        setOpen(!open);
        clearErrors();
    };

    const handleSearch = debounce((value) => {
        router.get(
            "/admin/web/research-journal/jebmpa",
            { search: value },
            {
                preserveState: true,
                replace: true,
            }
        );
    }, 1000);

    const hasUnsavedChanges = () => {
        return JSON.stringify(data) !== JSON.stringify(initialData);
    };

    const handleUpload = () => {
        clearErrors();
        post("/admin/web/research-journal/upload", {
            onSuccess: () => {
                handleOpen();
                toast.success("Journal uploaded successfully.");
            },
        });
    };

    const handleUpdate = () => {
        clearErrors();
        post("/admin/web/research-journal/update", {
            onSuccess: () => {
                handleOpen();
                toast.success("Journal updated successfully.");
            },
        });
    };

    const handleDelete = () => {
        setLoadingDelete(true);
        router.post(
            "/admin/web/research-journal/delete",
            { id: showDelete.id },
            {
                onSuccess: () => {
                    toast.success("Journal deleted successfully.");
                },
                onFinish: () => {
                    setLoadingDelete(false);
                    setShowDelete({
                        id: null,
                        title: "",
                        show: false,
                    });
                },
            }
        );
    };

    useEffect(() => {
        if (flash.error) toast.error(flash.error);
    }, [flash]);

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
                        Upload
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Volume</TableHead>
                            <TableHead>Issue</TableHead>
                            <TableHead>Published At</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {journals.data.map((journal) => (
                            <TableRow key={journal.id}>
                                <TableCell>{journal.title}</TableCell>
                                <TableCell>{journal.volume}</TableCell>
                                <TableCell>{journal.issue}</TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {formatDate(journal.published_at)}
                                </TableCell>
                                <TableCell className="text-right">
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
                                                onClick={() =>
                                                    handleOpen(journal)
                                                }
                                            >
                                                <FilePenLine />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setShowDelete({
                                                        id: journal.id,
                                                        title: journal.title,
                                                        show: true,
                                                    })
                                                }
                                                className="text-destructive"
                                            >
                                                <Trash />
                                                Delete
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
                                    journals.current_page > 1
                                        ? ""
                                        : "pointer-events-none opacity-50"
                                )}
                                onClick={() =>
                                    journals.current_page > 1 &&
                                    router.get(
                                        "/admin/web/research-journal/jebmpa",
                                        {
                                            page: journals.current_page - 1,
                                            search: search ?? "",
                                        },
                                        { preserveState: true }
                                    )
                                }
                            />
                        </PaginationItem>
                        {Array.from(
                            { length: journals.last_page },
                            (_, i) => i + 1
                        ).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    isActive={page === journals.current_page}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.get(
                                            "/admin/web/research-journal/jebmpa",
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
                                    journals.current_page < journals.last_page
                                        ? ""
                                        : "pointer-events-none opacity-50"
                                )}
                                onClick={() =>
                                    journals.current_page <
                                        journals.last_page &&
                                    router.get(
                                        "/admin/web/research-journal/jebmpa",
                                        {
                                            page: journals.current_page + 1,
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
                            {editData ? "Edit Journal" : "Upload Journal"}
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
                                                href={`/JEBMPA/${data.pdf_file}`}
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
                            <Label>Country</Label>
                            <CountryCombobox
                                options={countries}
                                value={data.country}
                                setValue={(val) => setData("country", val)}
                            />
                            <InputError message={errors.country} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                            <Label>Page number</Label>
                            <Input
                                value={data.page_number}
                                onChange={(e) =>
                                    setData("page_number", e.target.value)
                                }
                            />
                            <InputError message={errors.page_number} />
                        </div>
                        <div className="space-y-1">
                            <Label>Tracking number</Label>
                            <Input
                                value={data.tracking_number}
                                onChange={(e) =>
                                    setData("tracking_number", e.target.value)
                                }
                            />
                            <InputError message={errors.tracking_number} />
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
                            <Label>Abstract</Label>
                            <Textarea
                                value={data.abstract}
                                onChange={(e) =>
                                    setData("abstract", e.target.value)
                                }
                            />
                            <InputError message={errors.abstract} />
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

            <AlertDialog open={showDelete.show}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{showDelete.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to permanently delete this
                            journal? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() =>
                                setShowDelete({
                                    id: null,
                                    title: "",
                                    show: false,
                                })
                            }
                            disabled={loadingDelete}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loadingDelete}
                        >
                            {loadingDelete && (
                                <Loader className="animate-spin" />
                            )}
                            {loadingDelete ? "Deleting" : "Delete"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

JEBMPA.layout = (page) => (
    <AppLayout
        children={page}
        title="List of DIT.ADS Journal of Economics, Business Management, and Public Administration"
    />
);
