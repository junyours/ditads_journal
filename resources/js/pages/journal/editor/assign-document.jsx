import AppLayout from "@/layouts/app-layout";
import { usePage } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, MoreHorizontal } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";

export default function AssignDocument() {
    const { journals } = usePage().props;

    const columns = [
        {
            accessorKey: "request.request_number",
            header: "Request Number",
        },
        {
            accessorKey: "user.name",
            header: "Author Name",
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
                            <DropdownMenuItem>
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
            <DataTable columns={columns} data={journals} button={null} />
        </>
    );
}

AssignDocument.layout = (page) => (
    <AppLayout children={page} title="Assign Documents" />
);
