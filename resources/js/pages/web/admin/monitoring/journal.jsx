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

export default function Journal() {
    const { search, journals } = usePage().props;
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
        submission: "",
        institution: "",
        paper_type: "",
        paper_file: null,
        date_accomplished: null,
        status_whole_paper: "",
        urgency: "",
        processing_status: "",
        date_published: null,
        doi: "",
    });

    const handleOpen = (journal = null) => {
        if (journal) {
            setEditData(true);
            const journalData = {
                id: journal.id,
                submission: journal.submission,
                institution: journal.institution,
                paper_type: journal.paper_type,
                paper_file: journal.paper_file,
                date_accomplished: journal.date_accomplished,
                status_whole_paper: journal.status_whole_paper,
                urgency: journal.urgency,
                processing_status: journal.processing_status,
                date_published: journal.date_published,
                doi: journal.doi,
            };
            setData(journalData);
            setInitialData(journalData);
        } else {
            setEditData(false);
            const newData = {
                id: null,
                submission: "",
                institution: "",
                paper_type: "",
                paper_file: null,
                date_accomplished: null,
                status_whole_paper: "",
                urgency: "",
                processing_status: "",
                date_published: null,
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
        post("/admin/web/monitoring/journal/add", {
            onSuccess: () => {
                handleOpen();
                toast.success("Journal monitoring added successfully.");
            },
        });
    };

    const handleUpdate = () => {
        clearErrors();
        post("/admin/web/monitoring/journal/update", {
            onSuccess: () => {
                handleOpen();
                toast.success("Journal monitoring updated successfully.");
            },
        });
    };

    const handleSearch = debounce((value) => {
        router.get(
            "/admin/web/monitoring/journal",
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
                            <TableHead>Submission</TableHead>
                            <TableHead>School/Institution/Agency</TableHead>
                            <TableHead>Type of Paper</TableHead>
                            <TableHead>Paper File</TableHead>
                            <TableHead>Date to be Accomplished</TableHead>
                            <TableHead>Status of the Whole Paper</TableHead>
                            <TableHead>Urgency</TableHead>
                            <TableHead>Processing Status</TableHead>
                            <TableHead>Date Published</TableHead>
                            <TableHead>DOI</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {journals.data.map((journal, index) => (
                            <TableRow key={index}>
                                <TableCell>{journal.submission}</TableCell>
                                <TableCell>{journal.institution}</TableCell>
                                <TableCell className="capitalize">
                                    {journal.paper_type?.split("_").join(" ")}
                                </TableCell>
                                <TableCell>
                                    <a
                                        target="_blank"
                                        href={`/view-pdf/${journal.paper_file}`}
                                        className="hover:underline hover:text-primary"
                                    >
                                        {journal.paper_file}
                                    </a>
                                </TableCell>
                                <TableCell>
                                    {formatDate(journal.date_accomplished)}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {journal.status_whole_paper
                                        ?.split("_")
                                        .join(" ")}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {journal.urgency?.split("_").join(" ")}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {journal.processing_status
                                        ?.split("_")
                                        .join(" ")}
                                </TableCell>
                                <TableCell>
                                    {formatDate(journal.date_published)}
                                </TableCell>
                                <TableCell>{journal.doi}</TableCell>
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
                                                onClick={() =>
                                                    handleOpen(journal)
                                                }
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
                                    journals.current_page > 1
                                        ? ""
                                        : "pointer-events-none opacity-50"
                                )}
                                onClick={() =>
                                    journals.current_page > 1 &&
                                    router.get(
                                        "/admin/web/monitoring/journal",
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
                                            "/admin/web/monitoring/journal",
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
                                        "/admin/web/monitoring/journal",
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
                            {editData
                                ? "Edit Journal Monitoring"
                                : "Add Journal Monitoring"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-2">
                        <div className="space-y-1">
                            <Label>Submission</Label>
                            <Textarea
                                value={data.submission}
                                onChange={(e) =>
                                    setData("submission", e.target.value)
                                }
                            />
                            <InputError message={errors.submission} />
                        </div>
                        <div className="space-y-1">
                            <Label>School/Institution/Agency</Label>
                            <Input
                                value={data.institution}
                                onChange={(e) =>
                                    setData("institution", e.target.value)
                                }
                            />
                            <InputError message={errors.institution} />
                        </div>
                        <div className="space-y-1">
                            <Label>Type of Paper</Label>
                            <Select
                                value={data.paper_type}
                                onValueChange={(val) =>
                                    setData("paper_type", val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="journal">
                                        Journal
                                    </SelectItem>
                                    <SelectItem value="whole_paper">
                                        Whole Paper
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.paper_type} />
                        </div>
                        <div className="space-y-1">
                            <Label>Paper File</Label>
                            <Input
                                accept=".pdf"
                                type="file"
                                onChange={(e) =>
                                    setData("paper_file", e.target.files[0])
                                }
                            />
                            <InputError message={errors.paper_file} />
                        </div>
                        <div className="space-y-1">
                            <Label>Date to be Accomplished</Label>
                            <DatePicker
                                date={data.date_accomplished}
                                setDate={(date) =>
                                    setData("date_accomplished", date)
                                }
                            />
                            <InputError message={errors.date_accomplished} />
                        </div>
                        <div className="space-y-1">
                            <Label>Status of the Whole Paper</Label>
                            <Select
                                value={data.status_whole_paper}
                                onValueChange={(val) =>
                                    setData("status_whole_paper", val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="converted">
                                        Converted
                                    </SelectItem>
                                    <SelectItem value="not_yet_converted">
                                        Not Yet Converted
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status_whole_paper} />
                        </div>
                        <div className="space-y-1">
                            <Label>Urgency</Label>
                            <Select
                                value={data.urgency}
                                onValueChange={(val) => setData("urgency", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="urgent">
                                        Urgent
                                    </SelectItem>
                                    <SelectItem value="less">Less</SelectItem>
                                    <SelectItem value="not_urgent">
                                        Not Urgent
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.urgency} />
                        </div>
                        <div className="space-y-1">
                            <Label>Processing Status</Label>
                            <Select
                                value={data.processing_status}
                                onValueChange={(val) =>
                                    setData("processing_status", val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="preparation">
                                        Preparation
                                    </SelectItem>
                                    <SelectItem value="under_review">
                                        Under Review
                                    </SelectItem>
                                    <SelectItem value="on_going">
                                        On Going
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.processing_status} />
                        </div>
                        <div className="space-y-1">
                            <Label>Date Published</Label>
                            <DatePicker
                                date={data.date_published}
                                setDate={(date) =>
                                    setData("date_published", date)
                                }
                            />
                            <InputError message={errors.date_published} />
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

Journal.layout = (page) => (
    <AppLayout children={page} title="List of Journal Monitoring" />
);
