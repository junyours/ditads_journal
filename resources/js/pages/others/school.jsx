import AppLayout from "@/layouts/app-layout";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { FilePenLine, MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useForm, usePage } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputError from "@/components/input-error";

export default function School() {
    const { schools } = usePage().props;
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            id: null,
            name: "",
        });

    const handleOpen = (school = null) => {
        if (school) {
            setEditData(true);
            setData({
                id: school.id,
                name: school.name,
            });
        } else {
            setEditData(false);
            reset();
        }
        setOpen(!open);
        clearErrors();
    };

    const handleAdd = () => {
        clearErrors();
        post("/admin/others/schools/add", {
            onSuccess: () => {
                handleOpen();
            },
        });
    };

    const handleUpdate = () => {
        clearErrors();
        post("/admin/others/schools/update", {
            onSuccess: () => {
                handleOpen();
            },
        });
    };

    const columns = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const school = row.original;
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
                                onClick={() => handleOpen(school)}
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
                data={schools}
                button={{
                    title: "Add",
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
                            {editData ? "Edit School" : "Add School"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-2">
                        <div className="space-y-1">
                            <Label>Name</Label>
                            <Textarea
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            <InputError message={errors.name} />
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
                            onClick={editData ? handleUpdate : handleAdd}
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

School.layout = (page) => <AppLayout children={page} title="List of Schools" />;
