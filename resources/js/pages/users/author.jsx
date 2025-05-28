import { DataTable } from "@/components/table/data-table";
import AppLayout from "@/layouts/app-layout";
import Avatar from "../../../../public/images/user.png";
import { ColumnHeader } from "@/components/table/column-header";
import { usePage } from "@inertiajs/react";

export default function Author() {
    const { authors } = usePage().props;

    const columns = [
        {
            accessorKey: "avatar",
            header: "",
            cell: ({ row }) => {
                const consultant = row.original;
                return (
                    <div className="size-8">
                        <img
                            src={consultant.avatar ? consultant.avatar : Avatar}
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
    ];

    return <DataTable columns={columns} data={authors} button={null} />;
}

Author.layout = (page) => <AppLayout children={page} title="List of Authors" />;
