import WebLayout from "@/layouts/web-layout";
import { router, usePage } from "@inertiajs/react";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function Journal() {
    const { search, journals } = usePage().props;

    const handleSearch = debounce((value) => {
        router.get(
            "/monitoring/journal",
            { search: value },
            {
                preserveState: true,
                replace: true,
            }
        );
    }, 1000);

    return (
        <div className="space-y-4 p-4">
            <Input
                defaultValue={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-xs"
                placeholder="Search..."
                type="search"
            />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Submission</TableHead>
                        <TableHead>School/Institution/Agency</TableHead>
                        <TableHead>Type of Paper</TableHead>
                        <TableHead>Status of the Whole Paper</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>Processing Status</TableHead>
                        <TableHead>DOI</TableHead>
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
                            <TableCell>{journal.doi}</TableCell>
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
                                    "/monitoring/journal",
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
                                        "/monitoring/journal",
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
                                journals.current_page < journals.last_page &&
                                router.get(
                                    "/monitoring/journal",
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
    );
}

Journal.layout = (page) => <WebLayout children={page} />;
