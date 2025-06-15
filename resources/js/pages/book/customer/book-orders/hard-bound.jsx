import { ColumnHeader } from "@/components/table/column-header";
import AppLayout from "@/layouts/app-layout";
import { usePage } from "@inertiajs/react";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";

export default function HardBound() {
    const { orders } = usePage().props;

    const columns = [
        {
            accessorKey: "book_publication.cover_page",
            header: "",
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <div className="size-10">
                        <img
                            src={order.book_publication.cover_page}
                            alt="cover_page"
                            className="size-full object-contain"
                        />
                    </div>
                );
            },
        },
        {
            accessorKey: "book_publication.title",
            header: "Title",
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <ColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <Badge variant="secondary" className="capitalize">
                        {order.status}
                    </Badge>
                );
            },
        },
    ];

    return <DataTable columns={columns} data={orders} button={null} />;
}

HardBound.layout = (page) => (
    <AppLayout children={page} title="Hard Bound Orders" />
);
