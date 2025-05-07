import AppLayout from "@/layouts/app-layout";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnHeader } from "@/components/table/column-header";
import { FilePenLine, MoreHorizontal, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
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
import Pdf from "../../../../../public/images/pdf.png";
import { toast } from "sonner";
import DatePicker from "@/components/date-picker";
import Combobox from "@/components/combobox";
import countries from "../../../../../public/files/countries.json";

export default function ResearchJournal() {
    const { journals } = usePage().props;
    const [open, setOpen] = useState(false);
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
            title: "",
            author: "",
            abstract: "",
            pdf_file: null,
            published_at: null,
            country: "",
            page_number: "",
        });

    const handleOpen = (journal = null) => {
        if (journal) {
            setEditData(true);
            setData({
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
            });
        } else {
            setEditData(false);
            reset();
        }
        setOpen(!open);
        clearErrors();
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

    const columns = [
        {
            accessorKey: "title",
            header: "Title",
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
                const journal = row.original;
                return formatDate(journal.published_at);
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const journal = row.original;
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
                                onClick={() => handleOpen(journal)}
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
                data={journals}
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
                                                href={data.pdf_file}
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
                                {!editData && (
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
                                )}
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
                            <Combobox
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
                            <Label>Published at</Label>
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

ResearchJournal.layout = (page) => (
    <AppLayout children={page} title="List of Research Journals" />
);
