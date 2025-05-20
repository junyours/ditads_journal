import AppLayout from "@/layouts/app-layout";
import { useForm, usePage } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    FileText,
    MoreHorizontal,
    Plus,
    Upload,
} from "lucide-react";
import { DataTable } from "@/components/table/data-table";
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
import Word from "../../../../../public/images/word.png";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Combobox from "@/components/combobox";

export default function Request() {
    const { schools, journals } = usePage().props;
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            id: null,
            journal_file: null,
            school: null,
            co_authors: [],
        });
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [request, setRequest] = useState(null);

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleIsOpen = (request = null) => {
        if (request) {
            setRequest(request);
        } else {
            setRequest(null);
        }
        setIsOpen(!isOpen);
    };

    const handleSubmit = () => {
        clearErrors();
        post("/author/journal/requests/submit", {
            onSuccess: () => {
                handleOpen();
                toast.success("Journal uploaded successfully.");
            },
        });
    };

    const columns = [
        {
            accessorKey: "request_number",
            header: "Request Number",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const request = row.original;
                return (
                    <Badge
                        variant={
                            request.status === "pending"
                                ? "secondary"
                                : "default"
                        }
                        className="capitalize"
                    >
                        {request.status}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const request = row.original;
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
                                onClick={() => handleIsOpen(request)}
                            >
                                <FileText />
                                View
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
                    title: "Submit",
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
                        <SheetTitle>Submit Journal</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-2">
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <div className=" flex items-center space-x-4 rounded-md border p-4">
                                    <img src={Word} className="size-8" />
                                    <div className="flex-1 space-y-1">
                                        {data.journal_file ? (
                                            <>
                                                <p className="text-sm font-medium leading-none">
                                                    {data.journal_file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Word document
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-sm font-medium leading-none">
                                                No file chosen
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() =>
                                            document
                                                .getElementById("journal_file")
                                                .click()
                                        }
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <Upload />
                                    </Button>
                                </div>
                                <input
                                    accept=".docx"
                                    id="journal_file"
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "journal_file",
                                            e.target.files[0]
                                        )
                                    }
                                    hidden
                                />
                                <InputError message={errors.journal_file} />
                            </div>
                            <div className="space-y-1">
                                <Combobox
                                    options={schools}
                                    value={data.school}
                                    setValue={(val) => setData("school", val)}
                                />
                                <InputError message={errors.school} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Co - Author/s</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setData("co_authors", [
                                            ...data.co_authors,
                                            { name: "", school: null },
                                        ])
                                    }
                                >
                                    Add
                                </Button>
                            </div>

                            {data.co_authors.map((coAuthor, index) => (
                                <div className="space-y-2" key={index}>
                                    <div className="space-y-1">
                                        <div className="flex items-end justify-between">
                                            <Label>Name</Label>
                                            <Label
                                                className="hover:underline text-destructive cursor-pointer"
                                                onClick={() => {
                                                    const updated =
                                                        data.co_authors.filter(
                                                            (_, i) =>
                                                                i !== index
                                                        );
                                                    setData(
                                                        "co_authors",
                                                        updated
                                                    );
                                                }}
                                            >
                                                Remove
                                            </Label>
                                        </div>
                                        <Input
                                            value={coAuthor.name}
                                            onChange={(e) => {
                                                const updated = [
                                                    ...data.co_authors,
                                                ];
                                                updated[index].name =
                                                    e.target.value;
                                                setData("co_authors", updated);
                                            }}
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `co_authors.${index}.name`
                                                ]
                                            }
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Combobox
                                            options={schools}
                                            value={coAuthor.school}
                                            setValue={(val) => {
                                                const updated = [
                                                    ...data.co_authors,
                                                ];
                                                updated[index].school = val;
                                                setData("co_authors", updated);
                                            }}
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `co_authors.${index}.school`
                                                ]
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
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
                        <Button onClick={handleSubmit} disabled={processing}>
                            Save
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <Dialog open={isOpen} onOpenChange={() => handleIsOpen()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Request Number: {request?.request_number}
                        </DialogTitle>
                    </DialogHeader>
                    <div>
                        
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

Request.layout = (page) => <AppLayout children={page} title="Requests" />;
