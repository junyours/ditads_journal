import { Input } from "@/components/ui/input";
import WebLayout from "@/layouts/web-layout";
import { router, usePage } from "@inertiajs/react";
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
import { cn } from "@/lib/utils";

export default function Book() {
    const { search, books } = usePage().props;

    const handleSearch = debounce((value) => {
        router.get(
            "/monitoring/book",
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
                        <TableHead>Book Title</TableHead>
                        <TableHead>Chapter</TableHead>
                        <TableHead>Chapter Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Completed Book</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead>ISBN Submission</TableHead>
                        <TableHead>NLP Submission</TableHead>
                        <TableHead>Completed Electronic</TableHead>
                        <TableHead>DOI</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {books.data.map((book, index) => (
                        <TableRow key={index}>
                            <TableCell>{book.book_title}</TableCell>
                            <TableCell>{book.chapter}</TableCell>
                            <TableCell>{book.chapter_title}</TableCell>
                            <TableCell>{book.author}</TableCell>
                            <TableCell className="capitalize">
                                {book.completed_book?.split("_").join(" ")}
                            </TableCell>
                            <TableCell className="capitalize">
                                {book.status?.split("_").join(" ")}
                            </TableCell>
                            <TableCell className="capitalize">
                                {book.remarks?.split("_").join(" ")}
                            </TableCell>
                            <TableCell>{book.isbn_submission}</TableCell>
                            <TableCell>{book.nlp_submission}</TableCell>
                            <TableCell className="capitalize">
                                {book.completed_electronic
                                    ?.split("_")
                                    .join(" ")}
                            </TableCell>
                            <TableCell>{book.doi}</TableCell>
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
                                books.current_page > 1
                                    ? ""
                                    : "pointer-events-none opacity-50"
                            )}
                            onClick={() =>
                                books.current_page > 1 &&
                                router.get(
                                    "/monitoring/book",
                                    {
                                        page: books.current_page - 1,
                                        search: search ?? "",
                                    },
                                    { preserveState: true }
                                )
                            }
                        />
                    </PaginationItem>
                    {Array.from(
                        { length: books.last_page },
                        (_, i) => i + 1
                    ).map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                isActive={page === books.current_page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.get(
                                        "/monitoring/book",
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
                                books.current_page < books.last_page
                                    ? ""
                                    : "pointer-events-none opacity-50"
                            )}
                            onClick={() =>
                                books.current_page < books.last_page &&
                                router.get(
                                    "/monitoring/book",
                                    {
                                        page: books.current_page + 1,
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

Book.layout = (page) => <WebLayout children={page} />;
