import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { FilePenLine, MoreHorizontal, Plus, User } from "lucide-react";
import Avatar from "../../../../public/images/user.png";
import { ColumnHeader } from "@/components/table/column-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, usePage } from "@inertiajs/react";
import InputError from "@/components/input-error";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Author() {
    const { authors } = usePage().props;
    const [open, setOpen] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [editData, setEditData] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        id: null,
        name: "",
        email: "",
        avatar: null,
    });

    const handleOpen = (author = null) => {
        if (author) {
            setEditData(true);
            const authorData = {
                id: author.id,
                name: author.name,
                email: author.email,
            };
            setData(authorData);
            setInitialData(authorData);
            if (author.avatar) {
                setPreviewAvatar(author.avatar);
            } else {
                setPreviewAvatar(null);
            }
        } else {
            setEditData(false);
            const newData = {
                id: null,
                name: "",
                email: "",
            };
            setData(newData);
            setInitialData(newData);
            setPreviewAvatar(null);
        }
        setOpen(!open);
        clearErrors();
    };

    const hasUnsavedChanges = () => {
        return JSON.stringify(data) !== JSON.stringify(initialData);
    };

    const handleAdd = () => {
        clearErrors();
        post("/admin/users/author/add", {
            onSuccess: () => {
                handleOpen();
                toast.success("Author added successfully.");
            },
        });
    };

    const handleUpdate = () => {
        clearErrors();
        post("/admin/users/author/update", {
            onSuccess: () => {
                handleOpen();
                toast.success("Author updated successfully.");
            },
        });
    };

    const columns = [
        {
            accessorKey: "avatar",
            header: "",
            cell: ({ row }) => {
                const author = row.original;
                return (
                    <div className="size-8">
                        <img
                            src={author.avatar ? author.avatar : Avatar}
                            alt="user"
                            className="rounded-full size-full object-cover"
                        />
                    </div>
                );
            },
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <ColumnHeader column={column} title="Email" />
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const author = row.original;
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
                                onClick={() => handleOpen(author)}
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
                data={authors}
                button={{
                    title: "Add",
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
                            {editData ? "Edit Editor" : "Add Editor"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-2">
                        <div className="space-y-1">
                            <Label>Avatar</Label>
                            <div className="flex items-center gap-4">
                                <div className="size-20">
                                    {previewAvatar ? (
                                        <img
                                            src={previewAvatar}
                                            alt="profile-picture"
                                            className="object-cover size-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center size-full bg-muted">
                                            <User size={40} />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={() =>
                                        document
                                            .getElementById("avatar")
                                            .click()
                                    }
                                    size="sm"
                                    variant="outline"
                                >
                                    {previewAvatar ? "Change" : "Upload"}
                                </Button>
                                <input
                                    accept=".jpg,.jpeg,.png"
                                    id="avatar"
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setData("avatar", file);
                                        if (file) {
                                            const imageUrl =
                                                URL.createObjectURL(file);
                                            setPreviewAvatar(imageUrl);
                                        } else {
                                            setPreviewAvatar(null);
                                        }
                                    }}
                                    hidden
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label>Name</Label>
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-1">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <InputError message={errors.email} />
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
                            {editData ? "Update" : "Save"}
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

Author.layout = (page) => <AppLayout children={page} title="List of Authors" />;
